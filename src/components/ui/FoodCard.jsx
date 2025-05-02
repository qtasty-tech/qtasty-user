import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { X, ShoppingBag, Star } from 'lucide-react';

const FoodCard = ({ item, restaurantId,restaurantName }) => {
  const { addToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowDetails(false);
    };
    
    if (showDetails) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showDetails]);

  const handleAddToCart = () => {
    addToCart({
      ...item,

      // Ensure cart items have required fields
      quantity: 1,
      restaurantId: restaurantId, // Add restaurant ID if available
      restaurantName: restaurantName,
    });
    setShowDetails(false);
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  const incrementQuantity = (e) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <>
      <div 
        className="card bg-white rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex md:flex-row flex-col h-full">
          <div className="md:w-2/3 p-4">
            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
            <p className="text-gray-500 text-sm mb-2 line-clamp-2">{item.description}</p>
            <div className="flex items-center mt-auto">
              <span className="font-bold">${item.price.toFixed(2)}</span>
              {item.popular && (
                <span className="ml-2 bg-secondary text-supportive text-xs px-2 py-1 rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" /> Popular
                </span>
              )}
            </div>
          </div>
          {item.imageUrl && (
            <div className="md:w-1/3 relative">
              {!imageLoaded && (
                <div className="animate-pulse bg-gray-200 w-full h-full md:h-32 md:rounded-r-lg md:rounded-l-none rounded-b-lg rounded-t-none" />
              )}
              <img 
                src={item.imageUrl} 
                alt={item.name}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover md:h-32 md:rounded-r-lg md:rounded-l-none rounded-b-lg rounded-t-none ${
                  !imageLoaded ? 'hidden' : ''
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Food Item Details Modal */}
      {showDetails && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
        >
          <div 
            className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {item.imageUrl && (
              <div className="relative h-64">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(false);
                  }}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white">{item.name}</h2>
                  {item.popular && (
                    <div className="flex items-center mt-2">
                      <span className="bg-secondary text-supportive text-xs px-3 py-1 rounded-full flex items-center w-fit">
                        <Star className="w-3 h-3 mr-1" /> Popular Choice
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="p-6">
              <p className="text-gray-700 mb-6">{item.description}</p>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                {item.calories && (
                  <span className="text-gray-500 text-sm py-1 px-3 bg-gray-100 rounded-full">
                    {item.calories} calories
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button 
                    onClick={decrementQuantity}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <span className="font-bold text-lg">
                  Total: ${(item.price * quantity).toFixed(2)}
                </span>
              </div>
              
              {/* Add to Cart Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className="w-full py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-5 h-5" />
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