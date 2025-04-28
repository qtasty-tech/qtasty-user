
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [processing, setProcessing] = useState(false);
  const location = useLocation();
  const { deliveryAddress } = location.state || {}; // fallback if no address
  
  const deliveryFee = 3.99;
  const serviceFee = 2.49;
  const tax = totalPrice * 0.085; // 8.5% tax
  const total = totalPrice + deliveryFee + serviceFee + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      clearCart();
      
      // Redirect to confirmation
      navigate('/', { 
        state: { 
          orderPlaced: true,
          orderNumber: `BOW${Math.floor(Math.random() * 10000)}`
        } 
      });
    }, 2000);
  };

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="firstName">Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="lastName">Nummber</label>
                <input 
                  type="text" 
                  id="lastName" 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="address">Delivery Address</label>
              <div className="w-full p-3 border rounded-md bg-gray-100">
  {deliveryAddress ? (
    <p>{deliveryAddress}</p>
  ) : (
    <p className="text-gray-400">No delivery address selected</p>
  )}
</div>



            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="instructions">Delivery Instructions (Optional)</label>
              <textarea 
                id="instructions" 
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                rows="3"
                placeholder="Any special instructions for delivery..."
              ></textarea>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
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
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Service Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
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
            {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
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
