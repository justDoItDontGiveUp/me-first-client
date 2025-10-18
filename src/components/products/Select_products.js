
import { useEffect, useState } from "react";
import { Product } from "./Product";
import '../../css/Product.css';
import { useParams } from "react-router-dom";

export function Select_products() {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [projectProducts, setProjectProducts] = useState([]);
  const { username, projectId } = useParams();
  const [mode, setMode] = useState("show"); // show או select

  const fetchAllProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3333/${username}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAllProducts(data);
    } catch (err) {
      console.error("שגיאה בהבאת מוצרים:", err);
    }
  };

  const fetchProjectProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3333/${username}/project_products/${projectId}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjectProducts(data);
      setSelectedProducts(data.map(p => p.product_id));
    } catch (err) {
      console.error("שגיאה בהבאת מוצרים משויכים:", err);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchAllProducts();
      fetchProjectProducts();
    }
  }, [projectId]);

  const toggleProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSaveSelection = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3333/${username}/project_products/${projectId}/products`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds: selectedProducts }),
      });

      if (!res.ok) throw new Error("שגיאה בשמירת מוצרים");
      await fetchProjectProducts();
      setMode("show");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChooseMore = () => setMode("select");

  return (
    <div className="layout">
      {mode === "show" ? (
        <>
          <h2>מוצרים שנבחרו לפרויקט</h2>
          <div className="products-grid">
            {projectProducts.map(product => (
              <Product key={product.product_id} product={product} fromProject={true} />
            ))}
          </div>
          <button onClick={handleChooseMore}>בחר עוד מוצרים</button>
        </>
      ) : (
        <>
          <h2>בחר מוצרים לפרויקט</h2>
          <div className="products-grid">
            {allProducts.map(product => (
              <div key={product.product_id} className="product-with-checkbox">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.product_id)}
                  onChange={() => toggleProduct(product.product_id)}
                />
                <Product product={product} fromProject={true} />
              </div>
            ))}
          </div>
          <button onClick={handleSaveSelection}>💾 שמור מוצרים</button>
        </>
      )}
    </div>
  );
}
