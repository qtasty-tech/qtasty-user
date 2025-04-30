import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';
import md5 from 'crypto-js/md5';
import { Payhere, AccountCategory } from '@payhere-js-sdk/client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const location = useLocation();
  const { deliveryAddress } = location.state || {};
  const [orderId, setOrderId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    first_name: currentUser?.firstName || '',
    last_name: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: deliveryAddress || '',
    city: '',
    country: 'Sri Lanka'
  });
  
  // PayHere configuration
  const merchantId = 1226643;
  const merchantSecret = "MjM3ODE4NDE0MzU5NzQ4NTM4MzI4NTAzMTE3NjUyODA1MzY4MjIw";
  const deliveryFee = 200;
  const total = totalPrice + deliveryFee;

  // Generate frontend order ID
  useEffect(() => {
    const generateOrderId = () => {
      const frontendId = `BOW${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
      setOrderId(frontendId);
    };
    generateOrderId();
  }, []);

  // Initialize PayHere
  useEffect(() => {
    Payhere.init(merchantId, AccountCategory.SANDBOX);
  }, []);

  // Calculate PayHere hash
  const calculateHash = () => {
    const amountFormatted = total.toFixed(2).replace(/,/g, '');
    const hashedSecret = md5(merchantSecret).toString().toUpperCase();
    return md5(
      merchantId +
      orderId +
      amountFormatted +
      'LKR' +
      hashedSecret
    ).toString().toUpperCase();
  };

  const handleInputChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // Validate cart and user
      if (!currentUser) throw new Error('User not authenticated');
      if (cart.length === 0) throw new Error('Cart is empty');
      
      // Verify all items are from the same restaurant
      const restaurantId = cart[0].restaurantId;
      const sameRestaurant = cart.every(item => item.restaurantId === restaurantId);
      if (!sameRestaurant) throw new Error('All items must be from the same restaurant');

      // Create order payload
      const orderPayload = {
        user: currentUser._id,
        restaurant: restaurantId,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        deliveryAddress: customerDetails.address || deliveryAddress,
        paymentMethod: 'PayHere'
      };

      // Create order in backend
      const orderResponse = await axios.post('http://localhost:5001/api/orders', orderPayload);
      
      if (!orderResponse.data.success) {
        throw new Error('Failed to create order');
      }

      // Proceed with payment submission
      e.target.submit();
      
      // Clear cart after successful submission
      clearCart();

    } catch (err) {
      setProcessing(false);
      setError(err.response?.data?.message || err.message);
    }
  };

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Order Summary */}
          <div className="md:w-2/5">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#261F11]">Order Summary</h2>
                  <span className="text-sm font-medium px-3 py-1 bg-[#5DAA80]/10 text-[#5DAA80] rounded-full">
                    {orderId}
                  </span>
                </div>
                
                <div className="mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 bg-[#FAC849]/20 text-[#261F11] rounded-full text-xs font-bold mr-3">
                          {item.quantity}
                        </span>
                        <span className="font-medium text-[#261F11]">{item.name}</span>
                      </div>
                      <span className="font-medium text-[#261F11]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 text-[#261F11]/80">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-[#261F11]/80">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-[#261F11]">
                    <span>Total</span>
                    <span className="text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="bg-[#5DAA80]/10 p-4 rounded-lg">
                  <p className="text-sm text-[#5DAA80]">
                    Your order will be delivered to the address provided. Please ensure someone is available to receive it.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-medium text-[#261F11] mb-3">Payment Methods</h3>
                <div className="flex items-center space-x-4">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <img src="https://sandbox.payhere.lk/images/logo.png" alt="PayHere" className="h-6" />
                  </div>
                  <p className="text-sm text-[#261F11]/70">Secure payment via PayHere</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Checkout Form */}
          <div className="md:w-3/5">
            <h1 className="text-3xl font-bold mb-6 text-[#261F11]">Complete Your Order</h1>
            
            {error && (
              <div className="bg-[#F15D36]/10 text-[#F15D36] p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <form 
              method="post" 
              action="https://sandbox.payhere.lk/pay/preapprove"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Hidden PayHere required fields */}
              <input type="hidden" name="merchant_id" value={merchantId} />
              <input type="hidden" name="return_url" value="http://localhost:3000/return" />
              <input type="hidden" name="cancel_url" value="http://localhost:3000/cancel" />
              <input type="hidden" name="notify_url" value="http://localhost:3000/notify" />
              <input type="hidden" name="order_id" value={orderId} />
              <input type="hidden" name="items" value="Bowl Order" />
              <input type="hidden" name="currency" value="LKR" />
              <input type="hidden" name="amount" value={total.toFixed(2)} />
              <input type="hidden" name="hash" value={calculateHash()} />

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 text-[#261F11] flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#5DAA80] text-white rounded-full text-sm mr-3">1</span>
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#261F11] mb-2" htmlFor="first_name">First Name</label>
                    <input 
                      type="text" 
                      name="first_name"
                      value={customerDetails.first_name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#261F11] mb-2" htmlFor="last_name">Last Name</label>
                    <input 
                      type="text" 
                      name="last_name"
                      value={customerDetails.last_name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#261F11] mb-2" htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={customerDetails.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#261F11] mb-2" htmlFor="phone">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-transparent transition"
                      placeholder="+94 XX XXX XXXX"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 text-[#261F11] flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 bg-[#F15D36] text-white rounded-full text-sm mr-3">2</span>
                  Delivery Details
                </h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#261F11] mb-2" htmlFor="address">Delivery Address</label>
                  <input
                    type="text"
                    name="address"
                    value={customerDetails.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#261F11] mb-2" htmlFor="city">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={customerDetails.city}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5DAA80] focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#261F11] mb-2" htmlFor="country">Country</label>
                    <input 
                      type="text" 
                      name="country"
                      value="Sri Lanka"
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-[#261F11]/60"
                    />
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className={`w-full py-4 px-6 rounded-lg font-bold text-white text-lg transition ${
                  processing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#FAC849] hover:bg-[#FAC849]/90 shadow-lg hover:shadow-[#FAC849]/20'
                }`}
                disabled={processing}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Redirecting to PayHere...
                  </div>
                ) : (
                  `Pay ${total.toFixed(2)}`
                )}
              </button>
              
              <p className="text-center text-[#261F11]/60 text-sm">
                By placing your order, you agree to our <a href="#" className="text-[#5DAA80] hover:underline">Terms of Service</a> and <a href="#" className="text-[#5DAA80] hover:underline">Privacy Policy</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;