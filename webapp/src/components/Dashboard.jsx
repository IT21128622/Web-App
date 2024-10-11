import React,{ useState,useEffect }  from 'react'
import {  useSelector } from "react-redux";
import Card from './common/Card'
import UserChart from './common/UserChart';
import { FaShopify  ,FaBoxOpen , FaShoppingCart} from 'react-icons/fa';
import '../styles/dashboard.css'
import { getAllOrders } from "../api/services/orderService";
import { getAllProducts } from "../api/services/productService";
export default function Dashboard() {

    const [totalIncome, setTotalIncome] = useState(0); 
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const token = useSelector((state) => state.auth.loggedUser.token);

    const getTotalIncome = async () => {
        try{
            const response= await getAllOrders(token);
            console.log("response",response);

            const validOrders = response.filter(order => order.status !== 4);
            const income = validOrders.reduce((acc, order) => {
                return acc + parseFloat(order.totalPrice);
              }, 0);
              const totalOrderCount = validOrders.length;

               console.log("Income",income);
              setTotalOrders(totalOrderCount);
              setTotalIncome(income);
              setLoading(false); 
            } catch (err) {
              setError('Failed to fetch orders'); 
              setLoading(false); 
            }
    }
    
     const getTotalProducts = async () => {
        try{
            const response= await getAllProducts(token);
            console.log("response",response);
            const totalProductCount = response.length;
            console.log("Total Products",totalProductCount);
            setTotalProducts(totalProductCount);
            setLoading(false); 
          } catch (err) {
            setError('Failed to fetch products'); 
            setLoading(false); 
          }
     }

    useEffect(() => {
        getTotalIncome();
        getTotalProducts();
      }, []);
    
      if (loading) {
        return <p>Loading...</p>;
      }
    
      if (error) {
        return <p>{error}</p>; 
      }

  return (
    <div className="dashboard">
        <div className="dashboard-card">
        <Card 
        title="Total Income"
        icon={<FaShopify />}
        detail={`$ ${totalIncome.toFixed(2)}`} 
      />
      <Card 
        title="Total Orders"
        icon={<FaShoppingCart />}
        detail={`${totalOrders} Orders `}
      />
      <Card 
        title="Total Products"
        icon={<FaBoxOpen />}
        detail={`${totalProducts} Products`}
      />
        </div>
    
      <div >
      <UserChart/>
      </div>
    </div>
    
  )
}
