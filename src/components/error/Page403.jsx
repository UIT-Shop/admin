import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './errorPage.css';

function Page403() {
  const navigate = useNavigate();
  const removeLocalStorages = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_name');
    localStorage.removeItem('auth_email');
  };
  function goToLogin() {
    removeLocalStorages();
    navigate('/login');
  }
  return (
    <div className="container error-template ">
      <div className="message">Oops! You are not authorized.</div>
      <div className="message2">
        You tried to access a page you did not have prior authorization for.
      </div>
      <div className="error-actions">
        <button onClick={goToLogin} className="btn btn-primary btn-lg">
          Take Me To Login{' '}
        </button>

        <Link
          to="http://www.jquery2dotnet.com"
          className="btn btn-primary btn-lg"
        >
          Contact Support{' '}
        </Link>
      </div>
      <div className="error-container">
        <div className="neon">403</div>
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

export default Page403;
