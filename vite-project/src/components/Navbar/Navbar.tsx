import React from 'react'
import { Link } from 'react-router-dom'
const Navbar:React.FC=()=> {
  
  return (
    <div>
      Navbar
      <ul>
        <li ><Link to="/">Home</Link></li>
        <li ><Link to="/Login">Login</Link></li>
        <li ><Link to="/signUp">SignUp</Link></li>

      </ul>
    </div>
  )
}

export default Navbar
