import React from 'react';
import NavBar from './NavBar';
import SideBar from './SideBar';
import Footer from './Footer';

import '../common/assets/admin/css/styles.css';
import '../common/assets/admin/js/scripts.js';

import routes from '../routes/routes';
import { Routes, Route, Navigate } from 'react-router-dom';

const MasterLayout = () => {
  return (
    <div className="sb-nav-fixed">
      <NavBar />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <SideBar />
        </div>
        <div id="layoutSidenav_content">
          <Routes>
            {routes.map((route, index) => {
              return (
                <Route
                  key={index}
                  path={route.path}
                  name={route.name}
                  element={<route.element />}
                />
              );
            })}
            <Route path="/*" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MasterLayout;
