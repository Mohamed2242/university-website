// PrivateRoute.js
//import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";

function PrivateRoute({ children }) {
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  if(token){
    return children;
  }
  else{
    toast.error("Login first", { autoClose: 3000 });
    setTimeout(() => {
      navigate('/login'); // Navigate to login page
    }, 100); // Adjust delay as needed
    return null; // Return null for now, navigation happens after toast
  }
}

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired, // Validating the 'children' prop
};

export default PrivateRoute;
