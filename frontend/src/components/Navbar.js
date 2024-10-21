import React, { useContext } from 'react';
import logo from '../img/logo.png';
import '../css/Navbar.css';
import { Link } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ login }) {
  const navigate = useNavigate();
  const { setModalOpen } = useContext(LoginContext);

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return (
        <>
          <Link to="/profile"><li key="profile">Profile</li></Link>
          <Link to="/createPost"><li key="createPost">Create Post</li></Link>
          <Link style={{ marginLeft: "20px" }} to="followingpost"><li key="followingPost">My Following Post</li></Link>
          <li key="logout">
            <button className="primaryBtn" onClick={() => setModalOpen(true)}>Log Out</button>
          </li>
        </>
      );
    } else {
      return (
        <>
          <Link to="/signup"><li key="signup">Sign Up</li></Link>
          <Link to="/signin"><li key="signin">Sign In</li></Link>
        </>
      );
    }
  };

  return (
    <div className="navbar">
      <img src={logo} alt="" onClick={() => navigate("/")} />
      <ul className="nav-menu">
        {loginStatus()}
      </ul>
    </div>
  );
}
