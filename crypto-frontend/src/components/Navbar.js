import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/portfolio">Portfolio</Link>
      <Link to="/buy">Buy Crypto</Link>
      <Link to="/sell">Sell Crypto</Link>
    </nav>
  );
};

export default Navbar;