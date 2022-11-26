import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <>
    <div className="footer">
        <div className="row">
            <div className="footer-col-1">
                <h3>Download our App</h3>
                <p>Download our App for Android and Ios mobile phone</p>
                <div className="app-logo">
                    <img src="images/play-store.png" alt="" />
                    <img src="images/app-store.png" alt="" />
                </div>
            </div>
            <div className="footer-col-2">
                <img src="images/logo-white.png" alt="" />
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum unde rem ipsum perferendis ess</p>
            </div>
            <div className="footer-col-3">
                <h3>Useful Links</h3>
                <ul>
                    <li>Coupons</li>
                    <li>Blog Post</li>
                    <li>Return Policy</li>
                    <li>Join Affiliate</li>
                </ul>
            </div>
            <div className="footer-col-4">
            <h3>Follow us</h3>
                <ul>
                    <li>Facebook</li>
                    <li>Twitter</li>
                    <li>Instagram</li>
                    <li>Youtube</li>
                </ul>
            </div>
        </div>
    </div>
    </>
  )
}

export default Footer