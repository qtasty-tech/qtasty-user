import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  // Retrieve user ID and token from localStorage
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user data from localStorage
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  const userId = user ? user._id : null; // Get user ID from user object

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Ensure userId is available before making the API request
        if (userId) {
          const response = await axios.get(`http://localhost:7000/api/orders/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // Sort orders to make sure the latest order comes first
          setOrders(response.data.orders?.reverse() || []); // Reverse the orders to show the latest first
        } else {
          setError('User not logged in');
        }
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) {
      fetchOrders();
    }
  }, [userId, token]);

  // Function to get status color based on order status
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-200 text-gray-700';
    
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-[#5DAA80] text-white';
      case 'processing':
        return 'bg-[#FAC849] text-gray-800';
      case 'shipped':
        return 'bg-[#F15D36] text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };
  
  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-[#5DAA80] border-r-[#F15D36] border-b-[#FAC849] border-l-gray-800 border-solid rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg font-medium text-gray-800">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center m-4">
            <div className="text-[#F15D36] text-5xl mb-4">!</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button 
              className="mt-6 px-4 py-2 bg-[#5DAA80] text-white rounded-md hover:bg-opacity-90 transition-all"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#F15D36] text-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-gray-100 mt-1">Track and manage all your purchases</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-[#FAC849] text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't placed any orders yet.</p>
              <Link to="/products" className="inline-block px-6 py-3 bg-[#5DAA80] text-white font-medium rounded-md hover:bg-opacity-90 transition-all">
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:gap-8">
                {currentOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                    <div className="bg-[#5DAA80] text-white p-4 flex flex-wrap justify-between items-center">
                      <div className="mb-2 md:mb-0">
                        <span className="text-xs uppercase tracking-wider text-white opacity-80">Order ID</span>
                        <div className="font-mono text-sm">{order._id}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex flex-wrap justify-between items-center mb-4">
                        <div>
                          <span className="text-xs text-gray-500">Order Date</span>
                          <div className="font-medium text-gray-800">{formatDate(order.createdAt)}</div>
                        </div>
                        <div className="text-right mt-2 md:mt-0">
                          <span className="text-xs text-gray-500">Total Amount</span>
                          <div className="font-bold text-lg text-gray-800">${order.totalAmount}</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Order Items:</h4>
                        {order.items && order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-[#F15D36] mr-2"></div>
                              <span>{item.name}</span>
                            </div>
                            <div className="flex items-center space-x-6">
                              <span className="text-gray-500 text-sm">x{item.quantity}</span>
                              <span className="font-medium">${item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">Payment Details</h4>
                          <div className="bg-white p-3 rounded-md border border-gray-100">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-500">Method:</span>
                              <span className="font-medium">{order.paymentMethod || 'Not Provided'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Status:</span>
                              <span className={order.paymentStatus === 'Paid' ? 'text-[#5DAA80] font-medium' : 'text-[#F15D36] font-medium'}>
                                {order.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">Delivery Information</h4>
                          <div className="bg-white p-3 rounded-md border border-gray-100">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-500">Type:</span>
                              <span className="font-medium">{order.deliveryType}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Address:</span>
                              <span className="font-medium truncate max-w-xs">{order.deliveryAddress || 'Not Provided'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t border-gray-100 flex justify-end">
                      <Link 
                        to={`/delivery-progress/${order._id}`} 
                        className="px-4 py-2 bg-[#FAC849] text-gray-800 rounded-md font-medium hover:bg-opacity-90 transition-all"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center">
                    <button 
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#5DAA80] text-white hover:bg-opacity-90'}`}
                    >
                      Previous
                    </button>
                    
                    <div className="flex mx-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`mx-1 px-3 py-1 rounded ${currentPage === number ? 'bg-[#FAC849] text-gray-800' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                        >
                          {number}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`mx-1 px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#5DAA80] text-white hover:bg-opacity-90'}`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default MyOrders;