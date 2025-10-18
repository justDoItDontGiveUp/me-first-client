                 

import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Notification } from './Notification';
import { CircleUserRound, LogOut } from 'lucide-react';
import '../../css/Header.css';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const Header = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState('');
  const [title, setTitle] = useState('Home Page');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Invalid token", error);
        setUserRole('');
      }
    }
  }, [token]);

  useEffect(() => {
    setTitleOfHeader();
    console.log('Current path:', location.pathname);
    console.log('Title:', title);
  }, [location.pathname]);

  const setTitleOfHeader = () => {
    setTitle(
      location.pathname.includes('home') ? 'Home Page' :
      location.pathname.includes('close') ? 'Closed Projects' :
      location.pathname.includes('open') ? 'Opened Projects' :
      location.pathname.includes('products') ? 'Products' :
      location.pathname.includes('todos') ? 'Todos' :
      location.pathname.includes('suppliers') ? 'Suppliers' :
      location.pathname.includes('customers') ? 'Customers' :
      location.pathname.includes('agents') ? 'Agents' : ''
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <div className="header-container">
      <div className="profilee">
        <CircleUserRound className='profile' size={48} />
        <div className="userRole">{userRole}</div>
      </div>

      <div className='title'>{title}</div>

      <div className='endheader'>
        <Notification userRole={userRole} />
        <div className="logout-button">
          <button onClick={handleLogout}><LogOut /></button>
        </div>
      </div>

      <Outlet />
    </div>
  );
};
