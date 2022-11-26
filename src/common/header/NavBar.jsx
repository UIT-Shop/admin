import React, { useState } from 'react'
import logo from "../assets/images/logo.svg"
import { Link } from "react-router-dom"
import './NavBar.css'

const NavBar = () => {
    const [Email,setEmail] = useState("Account");
    
    return (
        <>
            <div className="container">
                <div className='navbar'>

                    <nav>
                        <ul id='MenuItems'>
                            <li><Link to="/"><h2>UIT Shop</h2></Link></li>
                            <li><Link to="/product">Man</Link></li>
                            <li><Link to="/product">Woman</Link></li>
                            <li><Link to="/product">Baby</Link></li>
                        </ul>
                        
                    </nav>
                    <nav className='RightSide'>
                        <ul id='rightMenu'>
                            <li><Link to="/Account"><img src="images/user.png" width="20px" height="20px" alt="" /></Link></li>
                            <li><Link to="/Cart"><img src="images/cart.png" width="20px" height="20px" alt="" /></Link></li>
                            <li><Link to="/Search"><img src="images/search.png" width="20px" height="20px" alt="" /></Link></li>
                            <li></li>
                        </ul>
                    </nav>
                    <img src="images/menu.png" alt='' className='menu-icon' onClick={() => {

                        // if(MenuItems.style.maxHeight === "0px")
                        // {
                        //     MenuItems.style.maxHeight = "200px";
                        // }
                        // else
                        // {
                        //     MenuItems.style.maxHeight = "0px"
                        // }
                    }} />
                </div>
            </div>
        </>
    )
}

export default NavBar