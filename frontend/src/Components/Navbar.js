import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink for active link highlighting
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <a href="/">MyLogo</a>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink exact to="/" activeClassName="active-link">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/about" activeClassName="active-link">About</NavLink>
                </li>
                <li>
                    <NavLink to="/services" activeClassName="active-link">Services</NavLink>
                </li>
                <li>
                    <NavLink to="/contact" activeClassName="active-link">Contact</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
