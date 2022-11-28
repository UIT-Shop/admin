import './App.css';
import AdminPrivateRoute from './AdminPrivateRoute';
import Login from './components/auth/Login';
import Page403 from './components/error/Page403';
import Page404 from './components/error/Page404';

import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('auth_token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

function App() {
  function parseJwt(token) {
    if (!token) {
      return;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
  const [user, setUser] = useState();
  useEffect(() => {
    setUser(parseJwt(sessionStorage.getItem('JWT')));
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/403"
            name="Forbidden"
            element={
              <div
                style={{
                  backgroundColor: '#1c2127',
                  height: 100 + 'vh',
                }}
              >
                <Page403 />
              </div>
            }
          />
          <Route
            path="/404"
            name="BadRequest"
            element={
              <div
                style={{
                  backgroundColor: '#1c2127',
                  height: 100 + 'vh',
                }}
              >
                <Page404 />
              </div>
            }
          />
          <Route path="/admin/*" name="Admin" element={<AdminPrivateRoute />} />
          <Route path="/*" element={<Navigate to="/admin/dashboard" />}></Route>
          {/* <Route path="/admin/*" name="Admin" element={<MasterLayout />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
