import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import RestaurantCard from "../components/ui/RestaurantCard";
import CategoryPill from "../components/ui/CategoryPill";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [activeCuisine, setActiveCuisine] = useState("all");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [allCuisines, setAllCuisines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all cuisines on initial load
  useEffect(() => {
    const fetchAllCuisines = async () => {
      try {
        const token = localStorage.getItem("token") || null;
        const response = await axios.get(
          `http://localhost:5001/api/restaurants/?cuisine=all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const mappedRestaurants = response.data.map((restaurant) => ({
          id: restaurant._id,
          name: restaurant.name,
          imageUrl: restaurant.image || "",
          rating: restaurant.rating || 0,
          isPromoted: restaurant.isPromoted || false,
          tags: restaurant.cuisine ? [restaurant.cuisine] : [],
          deliveryFee: restaurant.deliveryFee || 0,
          deliveryTime: restaurant.deliveryTime || 30,
          cuisine: restaurant.cuisine,
        }));

        // Generate unique cuisine list
        const uniqueCuisines = [
          { id: 0, name: "All", slug: "all" },
          ...Array.from(
            new Set(
              mappedRestaurants
                .map((r) => r.cuisine)
                .filter((c) => !!c && c !== "")
            )
          ).map((cuisine, index) => ({
            id: index + 1,
            name: cuisine.charAt(0).toUpperCase() + cuisine.slice(1),
            slug: cuisine.toLowerCase(),
          })),
        ];

        setAllCuisines(uniqueCuisines);
      } catch (error) {
        console.error("Error fetching all cuisines:", error);
      }
    };

    fetchAllCuisines();
  }, []);

  // Fetch restaurants based on selected cuisine
  useEffect(() => {
    const cuisine = searchParams.get("cuisine") || "all";
    setActiveCuisine(cuisine);

    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || null;
        const response = await axios.get(
          `http://localhost:5001/api/restaurants/?cuisine=${cuisine}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const mappedRestaurants = response.data.map((restaurant) => ({
          id: restaurant._id,
          name: restaurant.name,
          imageUrl: restaurant.image || "",
          rating: restaurant.rating || 0,
          isPromoted: restaurant.isPromoted || false,
          tags: restaurant.cuisine ? [restaurant.cuisine] : [],
          deliveryFee: restaurant.deliveryFee || 0,
          deliveryTime: restaurant.deliveryTime || 30,
          cuisine: restaurant.cuisine || "Various",
        }));

        // Set restaurant data
        setFilteredRestaurants(mappedRestaurants);

        // Set featured restaurants (random 3)
        const randomSelection = [...mappedRestaurants]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setFeaturedRestaurants(randomSelection);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden h-64">
          <div className="bg-gray-300 h-40 w-full"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-white py-0 relative overflow-hidden h-screen min-h-[600px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div 
            className="absolute inset-0 bg-center bg-cover z-0"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
              filter: "blur(2px)"
            }}
          ></div>
        </div>
        
        {/* Animated Food Icons */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[10%] left-[5%] animate-float-slow">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
              <path d="M14.829 9.172a3.001 3.001 0 0 0-1.027-1.747c-1.333-1.111-3.272-1.025-4.488.186a3.014 3.014 0 0 0-.789 1.351c-.034.125-.062.256-.082.385-.158 1.051.091 2.023.733 2.72l.001.001c.014.014.023.031.038.045l4.09 3.888c.084.08.192.12.3.12.109 0 .217-.04.301-.12l.767-.728c.166-.158.166-.42 0-.578l-3.56-3.382c-.136-.13-.173-.321-.093-.483.108-.22.377-.367.706-.297.073.016.107-.067.06-.118l-.041-.046c-.393-.448-.241-1.109.058-1.476.383-.472 1.039-.642 1.509-.171l.001.001c.228.216.365.508.376.814.005.151-.035.296-.112.416-.028.043-.003.101.05.101.363 0 .679.192.851.48.169.282.172.618.041.902a.19.19 0 0 0 .055.219l1.756 1.668c.15.143.17.379.047.542-.127.168-.352.204-.523.081l-1.773-1.685c-.069-.064-.159-.075-.221-.024-.079.064-.103.171-.055.267.063.124.098.265.098.412a.997.997 0 0 1-.999.999c-.563 0-1.036-.459-1.032-1.031 0-.118.029-.232.072-.339.032-.076-.035-.164-.107-.121a.57.57 0 0 0-.052.047c-.148.148-.152.384-.018.541l3.612 3.431c.166.158.166.42 0 .578l-.767.728a.421.421 0 0 1-.3.12c-.109 0-.217-.04-.301-.12l-4.091-3.888c-.368-.35-.615-.8-.723-1.28a2.695 2.695 0 0 1 .124-1.52c.024-.057-.052-.095-.089-.046a3.008 3.008 0 0 0-.288 2.392c.208.6.601 1.131 1.126 1.532l3.86 3.667c.26.247.605.383.972.383s.712-.136.972-.383l.767-.728c.536-.51.536-1.34 0-1.85l-3.981-3.782C14.705 11.094 14.368 10.103 14.829 9.172zM8.5 12c-.276 0-.5-.224-.5-.5s.224-.5.5-.5.5.224.5.5S8.776 12 8.5 12z"/>
            </svg>
          </div>
          <div className="absolute top-[20%] right-[15%] animate-float">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M2 19h20l-2 2H4l-2-2zM5 6h14c1.1 0 2 .9.2 2v9H3V8c0-1.1.9-2 2-2zm14 2H5v7h14V8z"/>
            </svg>
          </div>
          <div className="absolute bottom-[30%] left-[20%] animate-float-slow">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
              <path d="M1 21.98c0 .56.45 1.01 1.01 1.01H15c.56 0 1.01-.45 1.01-1.01V21H1v.98zM8.5 8.99C4.75 8.99 1 11 1 15h15c0-4-3.75-6.01-7.5-6.01zM3.62 13c1.11-1.55 3.47-2.01 4.88-2.01s3.77.46 4.88 2.01H3.62zM1 17h15v2H1zM18 5V1h-2v4h-5l.23 2h9.56l-1.4 14H18v2h1.72c.84 0 1.53-.65 1.63-1.47L23 5h-5z"/>
            </svg>
          </div>
          <div className="absolute bottom-[10%] right-[10%] animate-float">
            <svg width="45" height="45" viewBox="0 0 24 24" fill="white">
              <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z"/>
            </svg>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Content */}
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
                Delicious food, <br />
                <span className="text-accent">delivered</span> to you
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto md:mx-0 text-gray-100 animate-fade-in-up animation-delay-200">
                Order from your favorite restaurants and have your meal delivered
                right to your doorstep in minutes.
              </p>
              <div className="relative max-w-md mx-auto md:mx-0 bg-white rounded-full shadow-xl p-1 animate-fade-in-up animation-delay-300">
                <input
                  type="text"
                  placeholder="Enter food or restaurant name"
                  className="w-full py-4 px-6 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-accent hover:bg-accent-dark transition-colors text-white p-4 rounded-full shadow-lg">
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
              
              {/* Quick Stats */}
              <div className="flex justify-center md:justify-start space-x-8 mt-10 animate-fade-in-up animation-delay-400">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">500+</div>
                  <div className="text-sm text-gray-300">Restaurants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">50k+</div>
                  <div className="text-sm text-gray-300">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">30min</div>
                  <div className="text-sm text-gray-300">Average Delivery</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Food Image */}
            <div className="md:w-1/2 mt-8 md:mt-0 hidden md:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent to-accent-light blur-xl opacity-20 rounded-full"></div>
                
                <div className="absolute -bottom-4 -right-4 bg-white text-primary rounded-full p-4 shadow-xl animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,224L60,213.3C120,203,240,181,360,176C480,171,600,181,720,197.3C840,213,960,235,1080,229.3C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        {/* Mobile App CTA */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
          <a 
            href="#" 
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full transition-all duration-300 border border-white/20 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span>Download App</span>
          </a>
        </div>
      </section>

      {/* Cuisines Section */}
      <section className="py-4 border-b border-gray-200 sticky top-[56px] bg-white z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-2 scrollbar-hide gap-3">
            {allCuisines.map((cuisine) => (
              <CategoryPill
                key={cuisine.id}
                category={cuisine}
                isActive={activeCuisine === cuisine.slug}
                basePath="/"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              <span className="text-accent">Featured</span> Restaurants
            </h2>
            <a href="/restaurants" className="text-accent font-medium hover:underline flex items-center">
              View all
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It <span className="text-accent">Works</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary rounded-full p-4 mb-6 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Choose Restaurant</h3>
              <p className="text-gray-600">Browse through our extensive list of restaurants and cuisines to find what you're craving.</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary rounded-full p-4 mb-6 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Select Your Food</h3>
              <p className="text-gray-600">Choose from a variety of dishes and customize your order to your liking.</p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary rounded-full p-4 mb-6 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Our delivery partners will bring your food to your doorstep in no time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* All Restaurants */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            All <span className="text-accent">Restaurants</span>
          </h2>
          
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
          
          {!loading && filteredRestaurants.length > 9 && (
            <div className="flex justify-center mt-12">
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center">
                Load more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
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

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Stay updated with special offers</h2>
            <p className="text-gray-600 mb-8">Subscribe to our newsletter and never miss out on new promotions and discount codes!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary flex-grow max-w-md"
              />
              <button className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;