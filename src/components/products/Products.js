import { useEffect, useState } from "react";
import { Product } from "./Product";
import { AddOrEditProductForm } from "./AddOrEditProductForm";
import { Modal } from "../Modal";
import '../../css/Product.css';
import { useParams } from "react-router-dom";
import { UserPen, Trash2, PlusCircle } from 'lucide-react';

export function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { username } = useParams();

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3333/${username}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(data);
  };

  const handleDelete = async (product) => {
    try {
      const response = await fetch(`http://localhost:3333/${username}/products/${product.product_id}`, {
        method: "DELETE",
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error("Delete failed");
      fetchProducts();
    } catch (error) {
      console.error("שגיאה במחיקת מוצר:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [username]);

  const handleUpdated = () => {
    fetchProducts();
    closeForm();
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div className="layout">
      <PlusCircle color="green" onClick={openAddForm}/>

      {showForm && (
        <Modal onClose={closeForm}>
          <AddOrEditProductForm
            key={editingProduct?.product_id || 'new'}
            product={editingProduct}
            onSuccess={handleUpdated}
          />
        </Modal>
      )}

      <div className="products-grid">
        {products.map(product => (
          <div key={product.product_id} className="product-wrapper">
            <UserPen onClick={() => openEditForm(product)} />
            <Trash2 onClick={() => handleDelete(product)} />
            <Product
              product={product}
              fromProject={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
