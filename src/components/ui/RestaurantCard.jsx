import { useState } from 'react';
import { Clock, DollarSign, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      to={`/restaurant/${restaurant.id}`} 
      className="block rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={restaurant.imageUrl || "/api/placeholder/400/200"}
          alt={restaurant.name}
          className={`w-full h-48 object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        
        {/* Dark overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
        
        {/* Tags */}
        <div className="absolute bottom-3 left-3 flex flex-wrap">
          {Array.isArray(restaurant.tags) && restaurant.tags.length > 0 && restaurant.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-white text-gray-700 text-xs font-medium rounded-full px-3 py-1 mr-1 mb-1 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Promoted badge */}
        {restaurant.isPromoted && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold rounded-full px-3 py-1 shadow-md">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Restaurant header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">{restaurant.name}</h3>
          
          <div className="flex items-center bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full px-3 py-1">
            <Star className="w-4 h-4 mr-1 fill-yellow-500 stroke-yellow-500" />
            <span>{restaurant.rating}</span>
          </div>
        </div>
        
        {/* Cuisine type */}
        <p className="text-gray-500 text-sm mb-3 font-medium">{restaurant.cuisine}</p>
        
        {/* Delivery info */}
        <div className="flex items-center justify-between text-gray-600 text-sm border-t border-gray-100 pt-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-400" />
            <span>{restaurant.deliveryTime} min</span>
          </div>
          
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
            <span>${restaurant.deliveryFee} delivery</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;