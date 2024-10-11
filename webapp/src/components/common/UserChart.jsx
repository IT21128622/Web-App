import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAllUsers } from '../../api/services/authService';
import { useSelector } from 'react-redux';
import '../../styles/userChart.css'
export default function UserChart() {
 
ChartJS.register(ArcElement, Tooltip, Legend);


  const [csrCount, setCsrCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.loggedUser.token);
  const fetchUserCounts = async () => {
    try {
      
      const csrResponse = await getAllUsers(token , "csr");
      console.log("csrResponse",csrResponse);
      const vendorResponse = await getAllUsers(token , "vendor");
      const customerResponse = await getAllUsers(token , "customer");


      const totalcsr =  csrResponse.length;
      console.log("totalcsr",totalcsr);
      const vendors =  vendorResponse.length;
      const customers =  customerResponse.length;

      setCsrCount(totalcsr);
      setVendorCount(vendors);
      setCustomerCount(customers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user counts');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCounts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const data = {
    labels: [ 'CSR', 'Vendors', 'Customers'],
    datasets: [
      {
        label: 'User Count',
        data: [ csrCount, vendorCount, customerCount],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
      }
    ]
  };

  return (
    <div className="chart-container">
      <p>Current User Distribution</p>
      <Doughnut data={data} />
    </div>
  );
}
