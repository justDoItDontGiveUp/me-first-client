import { useParams, Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import '../../css/NavigationBar.css';
import {
  AlignJustify, CircleCheckBig, CircleX, Forward, House,
  Package, PackageOpen, Reply, ShoppingCart, UserRound
} from "lucide-react";

export function NavigationBar() {
  const { username } = useParams();
  const [barOpen, setBarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className={`sidebar ${barOpen ? 'open' : 'closed'}`}>
        <div className="menu-toggle" onClick={() => setBarOpen(!barOpen)}>
          <AlignJustify />
        </div>

        <Link to={`/${username}/home`} className="menu-item">
          <House />
          <span className="menu-text">Home</span>
        </Link>

        <Link to={`/${username}/contacts/customers`} className="menu-item">
          <Reply />
          <span className="menu-text">Customers</span>
        </Link>

        <Link to={`/${username}/contacts/suppliers`} className="menu-item">
          <Forward />
          <span className="menu-text">Suppliers</span>
        </Link>

        {user?.role === 'admin' && (
          <Link to={`/${username}/users/agents`} className="menu-item" title='Agents'>
            <UserRound />
            <span className="menu-text">Agents</span>
          </Link>
        )}

        <Link to={`/${username}/todos`} className="menu-item" title='Todos'>
          <CircleCheckBig />
          <span className="menu-text">Todos</span>
        </Link>

        <Link to={`/${username}/projects/close`} className="menu-item" title='Closed Projects'>
          <Package />
          <span className="menu-text">Closed Projects</span>
        </Link>

        <Link to={`/${username}/projects/open`} className="menu-item" title='Open Projects'>
          <PackageOpen />
          <span className="menu-text">Open Projects</span>
        </Link>

        <Link to={`/${username}/products`} className="menu-item" title='Products'>
          <ShoppingCart />
          <span className="menu-text">Products</span>
        </Link>
      </div>

      <div className="content">
        <Outlet />
      </div>
    </nav>
  );
}

export default NavigationBar;
