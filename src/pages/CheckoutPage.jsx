
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [processing, setProcessing] = useState(false);
  
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
                <label className="block text-gray-700 mb-2" htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="address">Delivery Address</label>
              <input 
                type="text" 
                id="address" 
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary mb-4"
                placeholder="Street address"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input 
                    type="text" 
                    id="city" 
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    id="state" 
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="State"
                    required
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    id="zip" 
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="ZIP Code"
                    required
                  />
                </div>
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
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <input 
                  type="radio" 
                  id="creditCard" 
                  name="paymentMethod" 
                  className="mr-2"
                  checked={paymentMethod === 'creditCard'}
                  onChange={() => setPaymentMethod('creditCard')}
                />
                <label htmlFor="creditCard" className="flex items-center">
                  <span className="mr-2">Credit Card</span>
                  <div className="flex space-x-1">
                    <div className="w-8 h-5 bg-blue-600 rounded"></div>
                    <div className="w-8 h-5 bg-red-500 rounded"></div>
                    <div className="w-8 h-5 bg-gray-800 rounded"></div>
                  </div>
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="paypal" 
                  name="paymentMethod" 
                  className="mr-2"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                <label htmlFor="paypal" className="flex items-center">
                  <span className="mr-2">PayPal</span>
                  <div className="w-8 h-5 bg-blue-800 rounded"></div>
                </label>
              </div>
            </div>
            
            {paymentMethod === 'creditCard' && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="cardNumber">Card Number</label>
                  <input 
                    type="text" 
                    id="cardNumber" 
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="expiry">Expiry Date</label>
                    <input 
                      type="text" 
                      id="expiry" 
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="cvc">CVC</label>
                    <input 
                      type="text" 
                      id="cvc" 
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="nameOnCard">Name on Card</label>
                  <input 
                    type="text" 
                    id="nameOnCard" 
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            )}
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
