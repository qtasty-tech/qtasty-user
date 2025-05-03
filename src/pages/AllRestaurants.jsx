import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import RestaurantCard from "../components/ui/RestaurantCard";
import CategoryPill from "../components/ui/CategoryPill";
import { Search, Sliders, ChevronDown, ChevronUp, X } from "lucide-react";

const AllRestaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [allCuisines, setAllCuisines] = useState([]);
  const [activeCuisine, setActiveCuisine] = useState({
    id: 0,
    name: "All",
    slug: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);

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
          priceRange: restaurant.deliveryFee || 0,
          isPromoted: restaurant.isPromoted || false,
          cuisine: restaurant.cuisine,
          deliveryFee: restaurant.deliveryFee || 0,
          deliveryTime: restaurant.deliveryTime || 30,
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
        setRestaurants(mappedRestaurants);
        setFilteredRestaurants(mappedRestaurants);
      } catch (error) {
        console.error("Error fetching all cuisines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCuisines();
  }, []);

  // Handle cuisine selection from URL and fetch restaurants
  useEffect(() => {
    const cuisineSlug = searchParams.get("cuisine") || "all";
    const selectedCuisine = allCuisines.find((c) => c.slug === cuisineSlug) || {
      id: 0,
      name: "All",
      slug: "all",
    };
    setActiveCuisine(selectedCuisine);

    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || null;
        const response = await axios.get(
          `http://localhost:5001/api/restaurants/?cuisine=${cuisineSlug}`,
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
          priceRange: restaurant.deliveryFee || 0,
          isPromoted: restaurant.isPromoted || false,
          cuisine: restaurant.cuisine || "Various",
          deliveryFee: restaurant.deliveryFee || 0,
          deliveryTime: restaurant.deliveryTime || 30,
        }));

        setRestaurants(mappedRestaurants);
        applyFilters(searchQuery, priceRange, ratingFilter, mappedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setFilteredRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    if (allCuisines.length > 0) {
      fetchRestaurants();
    }
  }, [searchParams, allCuisines]);

  // Handle Cuisine Selection
  const handleCuisineSelect = (cuisine) => {
    setSearchParams({ cuisine: cuisine.slug });
  };

  // Handle Search Input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(query, priceRange, ratingFilter, restaurants);
  };

  // Handle Price Range Filter
  const handlePriceChange = (e) => {
    const newPriceRange = e.target.value.split(",").map((val) => parseInt(val));
    setPriceRange(newPriceRange);
    applyFilters(searchQuery, newPriceRange, ratingFilter, restaurants);
  };

  // Handle Rating Filter
  const handleRatingChange = (e) => {
    const newRating = parseFloat(e.target.value);
    setRatingFilter(newRating);
    applyFilters(searchQuery, priceRange, newRating, restaurants);
  };

  // Apply all filters
  const applyFilters = (query, price, rating, restaurantsToFilter) => {
    const filtered = restaurantsToFilter.filter((restaurant) => {
      const matchesQuery =
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(query.toLowerCase());
      const matchesPrice =
        restaurant.priceRange >= price[0] && restaurant.priceRange <= price[1];
      const matchesRating = restaurant.rating >= rating;

      return matchesQuery && matchesPrice && matchesRating;
    });
    setFilteredRestaurants(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 1000]);
    setRatingFilter(0);
    setSearchParams({});
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-lg shadow-md overflow-hidden h-64 animate-pulse"
        >
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
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Favorite Food
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Browse from a wide range of restaurants and find the food that suits
            your craving.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for restaurant, cuisine, or food"
                className="w-full py-3 pl-10 pr-10 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent shadow-md"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setSearchQuery("");
                    applyFilters("", priceRange, ratingFilter, restaurants);
                  }}
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Cuisine Pills */}
            <div className="flex overflow-x-auto gap-3 py-1 flex-grow scrollbar-hide">
              {allCuisines.map((cuisine) => (
                <CategoryPill
                  key={cuisine.id}
                  category={cuisine}
                  isActive={cuisine.slug === activeCuisine.slug}
                  onClick={() => handleCuisineSelect(cuisine)}
                  basePath="/restaurants"
                />
              ))}
            </div>

            {/* Filter Toggle Button */}
            <button
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => setFiltersVisible(!filtersVisible)}
            >
              <Sliders className="mr-2 h-4 w-4" />
              Filters
              {filtersVisible ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {filtersVisible && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg animate-fadeIn">
              <div className="flex flex-wrap gap-6">
                {/* Price Range Filter */}
                <div className="flex-1 min-w-[250px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange.join(",")}
                    step="50"
                    onChange={handlePriceChange}
                    className="w-full accent-primary"
                  />
                </div>

                {/* Rating Filter */}
                <div className="flex-1 min-w-[250px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-primary focus:border-primary"
                    value={ratingFilter}
                    onChange={handleRatingChange}
                  >
                    <option value={0}>All Ratings</option>
                    <option value={1}>1 star & up</option>
                    <option value={2}>2 stars & up</option>
                    <option value={3}>3 stars & up</option>
                    <option value={4}>4 stars & up</option>
                    <option value={5}>5 stars</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(searchQuery ||
                  priceRange[0] > 0 ||
                  priceRange[1] < 1000 ||
                  ratingFilter > 0 ||
                  activeCuisine.slug !== "all") && (
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-primary hover:text-primary-dark font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* All Restaurants */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {activeCuisine.slug !== "all"
                ? `${activeCuisine.name} Restaurants`
                : "All Restaurants"}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredRestaurants.length}{" "}
              {filteredRestaurants.length === 1 ? "restaurant" : "restaurants"}{" "}
              found
            </span>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No restaurants found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search criteria
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
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

export default AllRestaurants;
