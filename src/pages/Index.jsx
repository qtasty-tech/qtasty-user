import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import RestaurantCard from "../components/ui/RestaurantCard";
import CategoryPill from "../components/ui/CategoryPill";

const categories = [
  { id: 1, name: "All", slug: "all" },
  { id: 2, name: "Pizza", slug: "pizza" },
  { id: 3, name: "Burgers", slug: "burgers" },
  { id: 4, name: "Sushi", slug: "sushi" },
  { id: 5, name: "Chinese", slug: "chinese" },
  { id: 6, name: "Italian", slug: "italian" },
  { id: 7, name: "Mexican", slug: "mexican" },
  { id: 8, name: "Healthy", slug: "healthy" },
  { id: 9, name: "Desserts", slug: "desserts" },
  { id: 10, name: "Breakfast", slug: "breakfast" },
];

const Index = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all restaurants
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    setActiveCategory(category);

    const fetchRestaurants = async () => {
      try {
        const category = searchParams.get("category") || "all";
        setActiveCategory(category);

        const token = localStorage.getItem("token") || null;
        const response = await axios.get(
          `http://restaurant-service:5001/api/restaurants/?category=${category}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Map the response to expected fields
        const mappedRestaurants = response.data.map((restaurant) => ({
          id: restaurant._id,
          name: restaurant.name,
          imageUrl: restaurant.image?.url || "", 
          rating: restaurant.rating || 0, 
          isPromoted: restaurant.isPromoted || false, 
          tags: restaurant.category ? [restaurant.category] : [], // Category to tags
          deliveryFee: restaurant.deliveryFee || 0, // Default value for now
          deliveryTime: restaurant.deliveryTime || 30, // Default 30 mins for now
          cuisine: restaurant.cuisine || "Various", // Default cuisine
        }));

        setFilteredRestaurants(mappedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [searchParams]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Delicious food, delivered to you
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Order from your favorite restaurants and have your meal delivered
            right to your doorstep.
          </p>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for restaurants or cuisines"
              className="w-full py-3 px-4 rounded-lg text-supportive focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent text-white p-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-6 border-b border-gray-200 sticky top-[56px] bg-white z-10 shadow-sm">
        <div className="container">
          <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3">
            {categories.map((category) => (
              <CategoryPill
                key={category.id}
                category={category}
                isActive={activeCategory === category.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-10">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Featured Restaurants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div>Loading...</div>
            ) : (
              filteredRestaurants
                .filter((restaurant) => restaurant.isPromoted)
                .map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))
            )}
          </div>
        </div>
      </section>

      {/* All Restaurants */}
      <section className="py-10 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">All Restaurants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div>Loading...</div>
            ) : (
              filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">
                Get the BiteOnWheels App
              </h2>
              <p className="text-lg mb-6">
                Download our mobile app and never miss a deal. Order your
                favorite food on the go!
              </p>
              <div className="flex space-x-4">
                <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center">
                  <svg
                    viewBox="0 0 384 512"
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                  >
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </button>
                <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center">
                  <svg
                    viewBox="0 0 512 512"
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                  >
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Mobile App"
                className="rounded-lg shadow-xl max-w-xs"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
