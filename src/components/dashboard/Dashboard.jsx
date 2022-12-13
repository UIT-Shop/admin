import React from 'react';
import Chart from './Chart';

const Dashboard = () => {
  return (
    <div className="card mb-4 w-100 h-100">
      <div className="card-header">
        <i className="fas fa-chart-area me-1"></i>
        Biểu đồ doanh thu
      </div>
      <div className="card-body w-100 h-100">
        <Chart />
      </div>
    </div>
  );
};

export default Dashboard;
