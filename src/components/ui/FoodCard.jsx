
import { useState } from 'react';
import { useCart } from '../../context/CartContext';

const FoodCard = ({ item }) => {
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = () => {
    addToCart(item);
    setShowDetails(false);
  };

  return (
    <>
      <div 
        className="card hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex md:flex-row flex-col h-full">
          <div className="md:w-2/3 p-4">
            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
            <p className="text-gray-500 text-sm mb-2 line-clamp-2">{item.description}</p>
            <div className="flex items-center mt-auto">
              <span className="font-bold">${item.price.toFixed(2)}</span>
              {item.popular && (
                <span className="ml-2 bg-secondary text-supportive text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
            </div>
          </div>
          {item.imageUrl && (
            <div className="md:w-1/3">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-full object-cover md:h-32 md:rounded-r-lg md:rounded-l-none rounded-b-lg rounded-t-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Food Item Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            {item.imageUrl && (
              <div className="relative h-56">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(false);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{item.name}</h2>
                {item.popular && (
                  <span className="bg-secondary text-supportive text-xs px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-gray-700 mb-6">{item.description}</p>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                {item.calories && (
                  <span className="text-gray-500 text-sm">{item.calories} calories</span>
                )}
              </div>
              
              {/* Add to Cart Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className="w-full py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodCard;
