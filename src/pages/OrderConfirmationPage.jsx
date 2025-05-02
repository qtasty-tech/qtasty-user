// OrderConfirmationPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderConfirmationPage = () => {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paymentRes = await axios.get(`/api/payments/${paymentId}`);
        setPayment(paymentRes.data);
        
        const ordersRes = await Promise.all(
          paymentRes.data.orders.map(orderId => 
            axios.get(`/api/orders/${orderId}`)
          )
        );
        setOrders(ordersRes.map(res => res.data));
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchData();
  }, [paymentId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
      {orders.map(order => (
        <div key={order._id} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {order.restaurant.name} (Order ID: {order._id})
          </h2>
          {/* Render order details */}
        </div>
      ))}
    </div>
  );
};

export default OrderConfirmationPage;