import React from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import avatar from "../assets/avatarImage.jpeg";

export default function Navbar() {
  return (
    <div className="navbar">
      {/* User Profile Section */}
      <div className="avatar">
        <img src={avatar} alt="User Avatar" />
        <div className="info">
          <h4 className="title">Admin</h4>
          <h6 className="status">Online</h6>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search__bar">
        <input type="text" placeholder="Search Employees..." />
        <FaSearch />
      </div>

      {/* Navbar Icons */}
      <div className="navbar__info">
        <IoMdNotificationsOutline />
        <FiMail />
        <button className="logout">
          <MdLogout />
          Logout
        </button>
      </div>
    </div>
  );
}
