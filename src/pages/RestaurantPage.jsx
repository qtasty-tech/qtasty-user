import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FoodCard from "../components/ui/FoodCard";

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menuRes, restaurantRes] = await Promise.all([
          fetch(`http://localhost:5001/api/restaurants/${id}/menu`),
          fetch(`http://localhost:5001/api/restaurants/customer/${id}`),
        ]);

        if (!restaurantRes.ok || !menuRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const menuData = await menuRes.json();
        const restaurantData = await restaurantRes.json();

        if (!menuData.success) {
          throw new Error("Failed to load menu");
        }

        // Use restaurantData for restaurant details and menuData.categories for categories
        setRestaurant(restaurantData);
        setCategories(menuData.categories);
        setActiveCategory(menuData.categories[0]?.id || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="text-lg">Loading restaurant details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="text-red-500">Error: {error}</div>
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {restaurant.name}
          </h1>
          <div className="flex flex-wrap items-center text-sm md:text-base gap-x-4 gap-y-1">
            <span>{restaurant.cuisine}</span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-secondary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {restaurant.rating}
            </span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {restaurant.deliveryTime} min
            </span>
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
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
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                        activeCategory === category.id
                          ? "bg-primary text-white"
                          : "hover:bg-gray-100"
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
              <h3 className="font-bold text-xl mb-2">
                About {restaurant.name}
              </h3>
              <p className="text-gray-600 mb-4">{restaurant.description}</p>
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">
                    Address
                  </h4>
                  <p>{restaurant.address}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-500 mb-1">
                    Hours
                  </h4>
                  <p>{restaurant.hours}</p>
                </div>
              </div>
            </div>

            {categories.map((category) => (
              <div
                key={category.id}
                id={`category-${category.id}`}
                className={activeCategory === category.id ? "" : "hidden"}
              >
                <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {category.items.map((item) => (
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
