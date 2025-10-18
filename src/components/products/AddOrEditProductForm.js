import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import '../../css/AddOrEditProductForm.css'

export function AddOrEditProductForm({ onSuccess, product = null }) {
      const { username } = useParams();

  const [formProduct, setFormProduct] = useState({
    product_name: "",
    category: "dry",
    description: "",
    supplier_id: ""
  });

  useEffect(() => {
    if (product) {
      setFormProduct(product);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!product;

    try {
      const response = await fetch(
        `http://localhost:3333/${username}/products${isEdit ? `/${product.product_id}` : ""}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(formProduct)
        }
      );
      if (!response.ok) {
        throw new Error(isEdit ? "Failed to update product" : "Failed to add product");      
      }
      setFormProduct({
        product_name: "",
        category: "dry",
        description: "",
        supplier_id: ""
      });
      onSuccess?.(); // טען מחדש את הרשימה או סגור טופס
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>{product ? "עריכת מוצר" : "הוספת מוצר חדש"}</h2>

      <input
        type="text"
        placeholder="שם מוצר"
        value={formProduct.product_name}
        onChange={(e) =>
          setFormProduct({ ...formProduct, product_name: e.target.value })
        }
        required
      />

      <select
        value={formProduct.category}
        onChange={(e) =>
          setFormProduct({ ...formProduct, category: e.target.value })
        }
      >
        <option value="dry">יבש</option>
        <option value="wet">רטוב</option>
      </select>

      <textarea
        placeholder="תיאור"
        value={formProduct.description}
        onChange={(e) =>
          setFormProduct({ ...formProduct, description: e.target.value })
        }
        required
      />

      <input
        type="number"
        placeholder="מזהה ספק"
        value={formProduct.supplier_id}
        onChange={(e) =>
          setFormProduct({ ...formProduct, supplier_id: e.target.value })
        }
        required
      />

      <button type="submit">{product ? "עדכן מוצר" : "שמור מוצר"}</button>
    </form>
  );
}
