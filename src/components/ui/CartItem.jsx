
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      {/* Item Image */}
      {item.imageUrl ? (
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-16 h-16 object-cover rounded mr-4"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded mr-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
        </div>
      )}
      
      {/* Item Details */}
      <div className="flex-1">
        <h3 className="font-medium text-supportive">{item.name}</h3>
        <p className="text-gray-500 text-sm">${item.price.toFixed(2)}</p>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center">
        <button 
          onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-l text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="w-8 h-8 flex items-center justify-center bg-white border-t border-b border-gray-200 text-supportive">
          {quantity}
        </span>
        <button 
          onClick={() => handleQuantityChange(quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-r text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Item Total */}
      <div className="text-right ml-4 w-20">
        <div className="font-medium">${(item.price * quantity).toFixed(2)}</div>
        <button 
          onClick={() => removeFromCart(item.id)}
          className="text-accent text-sm mt-1 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
