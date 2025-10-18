// import { useParams } from "react-router-dom";
import '../../css/ContactOrUser.css';

export function Product({ product }) {
  return (
    <div className="component-1">
      <div className="ellipse-19"></div>
      <div className="david-shalom">{product.product_name}</div>
      <div className="frame-50">
        <div className="frame-47">
          <div className="company">category:</div>
          <div className="ivory">{product.category}</div>
        </div>
        <div className="frame-48">
          <div className="company">description:</div>
          <div className="ivory">{product.description}</div>
        </div>
        <div className="frame-49">
          <div className="company">supplier:</div>
          <div className="ivory">{product.supplier_id}</div>
        </div>
      </div>
    </div>
  );
}
