
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 left-2">
            {restaurant.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-block bg-white text-supportive text-xs font-medium rounded-full px-2 py-1 mr-1 mb-1"
              >
                {tag}
              </span>
            ))}
          </div>
          {restaurant.isPromoted && (
            <div className="absolute top-2 right-2 bg-accent text-white text-xs font-bold rounded-full px-3 py-1">
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg truncate">{restaurant.name}</h3>
            <div className="flex items-center bg-secondary text-supportive text-sm font-bold rounded px-2 py-1">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {restaurant.rating}
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-2 truncate">{restaurant.cuisine}</p>
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {restaurant.deliveryTime} min
            <span className="mx-2">•</span>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            ${restaurant.deliveryFee} delivery
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
