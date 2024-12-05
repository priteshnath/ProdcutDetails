import { useState } from "react";
import "./ProductPage.css";
import { useEffect } from "react";

const ProductPage = () => {
  const [formData, setFormData] = useState({
    prodName: "",
    prodPrice: "",
    prodQty: "",
    prodAmt: "",
  });

  const [products, setProdcuts] = useState(() => {
    const savedProducts = localStorage.getItem("Prod");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [total, setTotal] = useState(0);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      prodAmt:
        name === "prodPrice" || name === "prodQty"
          ? (name === "prodPrice" ? value : prev.prodPrice) *
            (name === "prodQty" ? value || 1 : 1)
          : prev.prodAmt,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      const updatedProducts = products.map((product) =>
        product.id === editProductId ? { ...product, ...formData } : product
      );
      setProdcuts(updatedProducts);
      setEditMode(false);
      setEditProductId(null);
    } else {
      const newProduct = { ...formData, id: Date.now() };
      const updatedProduct = [...products, newProduct];
      setProdcuts(updatedProduct);
    }
    setFormData({ prodName: "", prodPrice: "", prodQty: "", prodAmt: "" });
  };

  const handleDelete = (id) => {
    const filteredProducts = products.filter((product) => product.id !== id);
    setProdcuts(filteredProducts);
  };

  const handleEdit = (id) => {
    const productToEdit = products.find((product) => product.id === id);
    setFormData({
      prodName: productToEdit.prodName,
      prodPrice: productToEdit.prodPrice,
      prodQty: productToEdit.prodQty,
      prodAmt: productToEdit.prodAmt,
    });
    setEditMode(true);
    setEditProductId(id);
  };

  // Save products to localStorage whenever it changes
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("Prod", JSON.stringify(products));

      const newTotal = products.reduce(
        (acc, curr) => acc + parseFloat(curr.prodAmt || 0),
        0
      );
      setTotal(newTotal);
    } else {
      localStorage.removeItem("Prod");
      setTotal(0);
    }
  }, [products]);

  return (
    <>
      <div className="main mb-10">
        <form action="" onSubmit={handleFormSubmit}>
          <h2>Product Form</h2>
          <div>
            <label htmlFor="prodName">Product Name</label>
            <input
              type="text"
              name="prodName"
              placeholder="Enter Porduct Name"
              onChange={handleInput}
              value={formData.prodName}
              required
            />
          </div>
          <div>
            <label htmlFor="prodPrice">Product Price</label>
            <input
              type="text"
              name="prodPrice"
              placeholder="Enter Porduct Price"
              onChange={handleInput}
              value={formData.prodPrice}
              required
            />
          </div>
          <div>
            <label htmlFor="prodQty">Product Quantity</label>
            <input
              type="text"
              name="prodQty"
              placeholder="Enter Porduct Quantity"
              onChange={handleInput}
              value={formData.prodQty}
              required
            />
          </div>
          <div>
            <label htmlFor="prodAmt">Product Amount</label>
            <input
              type="text"
              name="prodAmt"
              placeholder="Enter Porduct Amount"
              value={formData.prodAmt}
              readOnly
            />
          </div>
          <div>
            <button>{editMode ? "Edit" : "Add"}</button>
          </div>
        </form>
        <div className="w-full flex justify-center items-center flex-col">
          <h2 className="text-3xl font-bold mb-4">Product Details</h2>
          <table className="w-[90%] p-4">
            <thead>
              <tr className="*:border-black *:border *:p-2">
                <th className="">Product Name</th>
                <th>Product Price</th>
                <th>Product Quantity</th>
                <th>Product Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((currProd) => {
                return (
                  <tr
                    key={currProd.id}
                    className="*:border-black *:border *:p-2 *:text-center"
                  >
                    <td>{currProd.prodName}</td>
                    <td>{currProd.prodPrice}</td>
                    <td>{currProd.prodQty}</td>
                    <td>{currProd.prodAmt}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(currProd.id)}
                        className="bg-black py-1 px-6 text-white mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(currProd.id)}
                        className="bg-black py-1 px-6 text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="text-xl px-10 py-3 text-right font-bold">Total : {total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
