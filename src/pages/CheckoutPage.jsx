
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';
import md5 from 'crypto-js/md5';
import { Payhere, AccountCategory } from '@payhere-js-sdk/client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Add auth context

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth(); // Get current user from auth context
  const location = useLocation();
  const { deliveryAddress } = location.state || {};
  const [orderId, setOrderId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Sri Lanka'
  });
  
  // PayHere configuration
  const merchantId = 1226643; // Replace with your merchant ID
  const merchantSecret = "MjM3ODE4NDE0MzU5NzQ4NTM4MzI4NTAzMTE3NjUyODA1MzY4MjIw"; // Replace with your secret
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
        user: currentUser._id, // Assuming your user ID field is _id
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
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form 
          method="post" 
          action="https://sandbox.payhere.lk/pay/preapprove"
          onSubmit={handleSubmit}
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

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="first_name">First Name</label>
                <input 
                  type="text" 
                  name="first_name"
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="last_name">Last Name</label>
                <input 
                  type="text" 
                  name="last_name"
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  name="email"
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="address">Delivery Address</label>
              <input
                type="text"
                name="address"
                value={deliveryAddress || ''}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="city">City</label>
                <input 
                  type="text" 
                  name="city"
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="country">Country</label>
                <input 
                  type="text" 
                  name="country"
                  value="Sri Lanka"
                  readOnly
                  className="w-full p-3 border rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold">Order Summary</h2>
    <div className="text-sm text-gray-600">
      Order ID: <span className="font-mono text-primary">{orderId}</span>
    </div>
  </div>
  
  <div className="mb-4 max-h-48 overflow-y-auto">
    {cart.map(item => (
      <div key={item.id} className="flex justify-between py-2 border-b">
        <div className="flex items-center">
          <span className="font-medium mr-2">{item.quantity}x</span>
          <span>{item.name}</span>
        </div>
        <span>${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ))}
  </div>
  
  <div className="mb-4">
    <div className="flex justify-between py-2">
      <span className="text-gray-600">Subtotal</span>
      <span>${totalPrice.toFixed(2)}</span>
    </div>
    <div className="flex justify-between py-2">
      <span className="text-gray-600">Delivery Fee</span>
      <span>${deliveryFee.toFixed(2)}</span>
    </div>
    <div className="border-t mt-2 pt-2 flex justify-between font-bold">
      <span>Total</span>
      <span>${total.toFixed(2)}</span>
    </div>
  </div>
</div>
          
          <button 
            type="submit" 
            className="w-full btn-accent block text-center py-4 text-lg font-bold mb-4"
            disabled={processing}
          >
            {processing ? 'Redirecting to PayHere...' : `Pay $${total.toFixed(2)}`}
          </button>
          
          <p className="text-center text-gray-500 text-sm">
            By placing your order, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
