import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import { FaHome, FaUser } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <Nav vertical>
        <NavItem className="nav-item">
          <Link to="/official" className="nav-link">
            <FaHome className="nav-icon" /> Officials
          </Link>
        </NavItem>
        <NavItem className="nav-item">
          <Link to="/person" className="nav-link">
            <FaUser className="nav-icon" /> Persons
          </Link>
        </NavItem>
        {/* Agrega más enlaces según sea necesario */}
      </Nav>
    </div>
  );
};

export default Sidebar;