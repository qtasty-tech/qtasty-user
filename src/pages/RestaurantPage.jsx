
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FoodCard from '../components/ui/FoodCard';

// Mock restaurant data
const restaurantData = {
  id: 1,
  name: 'Pizza Paradise',
  cuisine: 'Italian • Pizza • Pasta',
  address: '123 Main St, Foodville, CA',
  rating: 4.7,
  reviews: 342,
  deliveryTime: 25,
  deliveryFee: 3.99,
  tags: ['Pizza', 'Italian'],
  imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  coverImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  description: 'We serve authentic Italian pizza and pasta made with the finest ingredients. Our dough is freshly made daily and our sauce is a family recipe passed down through generations.',
  hours: 'Monday - Sunday: 11:00 AM - 10:00 PM',
  categories: [
    {
      id: 1,
      name: 'Pizza',
      items: [
        {
          id: 101,
          name: 'Margherita Pizza',
          description: 'Fresh mozzarella, tomato sauce, basil',
          price: 14.99,
          popular: true,
          imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          calories: '850',
        },
        {
          id: 102,
          name: 'Pepperoni Pizza',
          description: 'Pepperoni, mozzarella, tomato sauce',
          price: 16.99,
          popular: true,
          imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          calories: '980',
        },
        {
          id: 103,
          name: 'Vegetarian Pizza',
          description: 'Bell peppers, mushrooms, onions, olives, tomatoes, mozzarella',
          price: 17.99,
          popular: false,
          imageUrl: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          calories: '790',
        },
      ]
    },
    {
      id: 2,
      name: 'Pasta',
      items: [
        {
          id: 201,
          name: 'Spaghetti Carbonara',
          description: 'Pancetta, egg, black pepper, Parmesan cheese',
          price: 16.99,
          popular: true,
          imageUrl: 'https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          calories: '950',
        },
        {
          id: 202,
          name: 'Fettuccine Alfredo',
          description: 'Fettuccine pasta with creamy Alfredo sauce and Parmesan cheese',
          price: 15.99,
          popular: false,
          imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023882a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          calories: '1050',
        },
      ]
    },
    {
      id: 3,
      name: 'Sides',
      items: [
        {
          id: 301,
          name: 'Garlic Bread',
          description: 'Toasted bread with garlic butter and herbs',
          price: 5.99,
          popular: true,
          imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          calories: '320',
        },
        {
          id: 302,
          name: 'Caesar Salad',
          description: 'Romaine lettuce, croutons, Parmesan cheese, Caesar dressing',
          price: 8.99,
          popular: false,
          imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          calories: '380',
        },
      ]
    },
    {
      id: 4,
      name: 'Desserts',
      items: [
        {
          id: 401,
          name: 'Tiramisu',
          description: 'Coffee-flavored Italian dessert made of ladyfingers dipped in coffee, layered with a whipped mixture of eggs, sugar, and mascarpone cheese',
          price: 7.99,
          popular: true,
          imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          calories: '420',
        },
        {
          id: 402,
          name: 'Cannoli',
          description: 'Italian pastry desserts consisting of tube-shaped shells of fried pastry dough, filled with a sweet, creamy filling',
          price: 6.99,
          popular: false,
          imageUrl: 'https://images.unsplash.com/photo-1623246123320-0d6636755796?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          calories: '340',
        },
      ]
    },
  ]
};

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch restaurant data
    setTimeout(() => {
      setRestaurant(restaurantData);
      setActiveCategory(restaurantData.categories[0].id);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="text-lg">Loading restaurant details...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-10">
      {/* Restaurant Header with Cover Image */}
      <div className="relative h-64 bg-gray-300">
        <img 
          src={restaurant.coverImageUrl} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center text-sm md:text-base gap-x-4 gap-y-1">
            <span>{restaurant.cuisine}</span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {restaurant.rating} ({restaurant.reviews} reviews)
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {restaurant.deliveryTime} min
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              ${restaurant.deliveryFee} delivery
            </span>
          </div>
        </div>
      </div>

      {/* Restaurant Info and Menu */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu Navigation - Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Menu</h3>
              <ul className="space-y-2">
                {restaurant.categories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                        activeCategory === category.id 
                          ? 'bg-primary text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-bold text-xl mb-2">About {restaurant.name}</h3>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">Address</h4>
                  <p>{restaurant.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">Hours</h4>
                  <p>{restaurant.hours}</p>
                </div>
              </div>
            </div>

            {restaurant.categories.map(category => (
              <div 
                key={category.id} 
                id={`category-${category.id}`}
                className={activeCategory === category.id ? '' : 'hidden'}
              >
                <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {category.items.map(item => (
                    <FoodCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;
