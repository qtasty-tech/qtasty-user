import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope, FaPhoneAlt, FaExclamationTriangle, FaTruck } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Add Axios interceptor to include the token in all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const PaymentSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isProcessed, setIsProcessed] = useState(false); // Track if order was processed
  const currentUser = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    const processOrder = async () => {
      try {
        const orderData = JSON.parse(localStorage.getItem('pendingOrder'));
        if (!orderData || isProcessed) { // Skip if already processed
          return;
        }

        console.log('Current user:', currentUser._id);
        // Create payment transaction
        const paymentResponse = await axios.post('http://localhost:8000/api/payments/create', {
          user: currentUser?._id,
          amount: orderData.total,
          currency: 'LKR',
          paymentMethod: 'payhere',
          paymentStatus: 'completed'
        });

        // Create individual restaurant orders
        const orderPromises = orderData.restaurantOrders.map(async (restaurantOrder) => {
          const orderPayload = {
            user: currentUser._id,
            restaurant: restaurantOrder.restaurantId,
            customer: currentUser.name,
            phone: currentUser.phone,
            items: restaurantOrder.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            totalAmount: restaurantOrder.total,
            deliveryAddress: orderData.deliveryAddress,
            deliverylocation: {
              type: "Point",
              coordinates: [
                orderData.deliveryLocation.lng,
                orderData.deliveryLocation.lat
              ]
            },
            paymentMethod: 'payhere',
            paymentTransaction: paymentResponse.data._id
          };

          return axios.post('http://localhost:7000/api/orders', orderPayload);
        });

        const ordersResponse = await Promise.all(orderPromises);
        console.log('Orders created:', ordersResponse);

        // Update payment transaction with order IDs
        const orderIds = ordersResponse.map(res => res.data.order._id);
        await axios.patch(`http://localhost:8000/api/payments/${paymentResponse.data._id}`, {
          orders: orderIds
        });

        // Set order details for display
        setOrderDetails({
          mainOrderId: orderId,
          restaurantOrders: orderData.restaurantOrders,
          paymentTotal: orderData.total,
          deliveryAddress: orderData.deliveryAddress
        });

        // Mark as processed and clear storage
        setIsProcessed(true);
        localStorage.removeItem('pendingOrder');
        localStorage.removeItem('cart');
        setError(null);
      } catch (error) {
        console.error('Order processing failed:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && !isProcessed) { // Only run if not already processed
      processOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, currentUser, isProcessed]); // Add isProcessed to dependency array


  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mx-auto flex items-center justify-center w-16 h-16 mb-4">
            <FaExclamationTriangle className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h1>
          <p className="text-gray-600">Invalid order reference. Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-full w-12 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        ) : error ? (
          <>
            <div className="text-red-500 mx-auto flex items-center justify-center w-16 h-16 mb-4">
              <FaExclamationTriangle className="w-full h-full" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Order Processing Failed</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-gray-600">
              Your payment was successful but we encountered an issue processing your order. 
              Please contact support with your order ID: <strong>{orderId}</strong>
            </p>
          </>
        ) : (
          orderDetails && (
            <>
              <div className="text-green-500 mx-auto flex items-center justify-center w-16 h-16 mb-4">
                <FaCheckCircle className="w-full h-full" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-4">Thank you for your purchase!</p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm font-semibold text-gray-700">Main Order ID</p>
                <p className="text-gray-600 font-mono">{orderDetails.mainOrderId}</p>
              </div>

              {orderDetails.restaurantOrders.map((restaurantOrder, index) => (
                <div key={index} className="mb-6 border-b pb-4 last:border-b-0">
                  <div className="flex items-center mb-3">
                    {restaurantOrder.restaurantLogo && (
                      <img 
                        src={restaurantOrder.restaurantLogo}
                        alt={restaurantOrder.restaurantName}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <h3 className="font-semibold">{restaurantOrder.restaurantName}</h3>
                    <span className="text-sm text-gray-500 ml-2">
                      (Order ID: {restaurantOrder.orderId})
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    {restaurantOrder.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between py-2">
                        <div>
                          <span className="mr-2">{item.quantity}x</span>
                          {item.name}
                        </div>
                        <div>${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t pt-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Need Help?</h3>
                <div className="flex justify-center space-x-6">
                  <div className="flex items-center text-gray-500 hover:text-blue-600">
                    <FaEnvelope className="mr-2" />
                    <a href="mailto:support@example.com">Email Support</a>
                  </div>
                  <div className="flex items-center text-gray-500 hover:text-blue-600">
                    <FaPhoneAlt className="mr-2" />
                    <a href="tel:+11234567890">+1 (123) 456-7890</a>
                  </div>
                </div>
                <button 
      onClick={() => navigate(`/delivery-progress/${orderDetails.mainOrderId}`)}
      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center"
    >
      <FaTruck className="mr-2" />
      Track Delivery Status
    </button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;