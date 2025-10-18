
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "./Product";
import { Mail } from 'lucide-react';
import "../../css/Product.css";

export function Project_products() {
  const [projectProducts, setProjectProducts] = useState([]);
  const { username, projectId } = useParams();

  const fetchProjectProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3333/${username}/project_products/${projectId}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("שגיאה בקבלת מוצרים לפרויקט");
      const data = await res.json();
      setProjectProducts(data);
    } catch (err) {
      console.error("שגיאה בהבאת מוצרים לפרויקט:", err);
    }
  };

  useEffect(() => {
    if (projectId) fetchProjectProducts();
  }, [projectId]);

  const handleSendMail = (email) => {
    const mailto = `mailto:${email || 'example@example.com'}`;
    window.location.href = mailto;
  };

  // העלאת QUOTE יכולה להיות מטופלת בקומפוננטה Product עצמה או כאן לפי צורך.

  return (
    <div className="layout">
      <h2>מוצרים בפרויקט</h2>
      <div className="products-grid">
        {projectProducts.map(product => (
          <div key={product.product_id} className="product-with-mail">
            <Mail onClick={() => handleSendMail(product.contact_email)} />
            <Product
              product={product}
              fromProject={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
