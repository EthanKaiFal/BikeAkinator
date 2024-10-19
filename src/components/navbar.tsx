import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; // Import CSS for styling

// Define the NavBar component with TypeScript
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">Bike Akinator</h1>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">Quiz</Link>
          </li>
          <li className="nav-item">
            <Link to="/Bikes" className="nav-link">Bikes</Link>
          </li>
          <li className="nav-item">
            <Link to="/" className="nav-link">Profile</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};


