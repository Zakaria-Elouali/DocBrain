import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = () => {
  const data = {
    labels: ['Savings', 'Investments', 'Debt'],
    datasets: [
      {
        data: [5000, 8000, 3000],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default DoughnutChart;
