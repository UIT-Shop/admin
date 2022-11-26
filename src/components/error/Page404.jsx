import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './errorPage.css';

function Page404() {
  return (
    <div className="container error-template ">
      <div className="message">Oops! </div>
      <div className="message2">
        Sorry, an error has occured, Requested page not found!
      </div>
      <div className="error-actions">
        <Link
          to="http://www.jquery2dotnet.com"
          className="btn btn-primary btn-lg"
        >
          Contact Support{' '}
        </Link>
      </div>
      <div className="error-container">
        <div className="neon">404</div>
        <div className="door-frame">
          <div className="door">
            <div className="rectangle"></div>
            <div className="handle"></div>
            <div className="window">
              <div className="eye"></div>
              <div className="eye eye2"></div>
              <div className="leaf"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page404;
