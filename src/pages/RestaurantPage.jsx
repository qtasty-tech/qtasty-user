import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import FoodCard from "../components/ui/FoodCard";

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const sectionRefs = useRef({});

  // Track scroll for parallax & active category
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      categories.forEach(cat => {
        const el = sectionRefs.current[`category-${cat.id}`];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            setActiveCategory(cat.id);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  // Fetch restaurant & menu data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menuRes, restRes] = await Promise.all([
          fetch(`http://localhost:5001/api/restaurants/${id}/menu`),
          fetch(`http://localhost:5001/api/restaurants/by-id/${id}`),
        ]);
        if (!menuRes.ok || !restRes.ok)
          throw new Error("Failed to fetch data");
        const menuData = await menuRes.json();
        const restData = await restRes.json();
        if (!menuData.success) throw new Error("Failed to load menu");
        setRestaurant(restData);
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

  // Smooth-scroll to a category
  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const el = document.getElementById(`category-${categoryId}`);
    if (!el) return;
    const offset = 100;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          className="text-center p-8 bg-white rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative h-16 w-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading amazing food...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          className="text-center p-8 max-w-lg bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative mb-6">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-100 rounded-full opacity-60" />
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-red-50 rounded-full opacity-60" />
            <svg
              className="w-20 h-20 text-red-500 mx-auto relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">
            Something went wrong
          </h2>
          <p className="text-red-500 mb-6 bg-red-50 py-2 px-4 rounded-lg inline-block">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-shadow"
            >
              Try Again
            </motion.button>
            <motion.button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cover Image Parallax */}
      <div className="relative h-96 md:h-[450px] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${restaurant.coverImageUrl})` }}
          animate={{ scale: scrolled ? 1.05 : 1, y: scrolled ? -20 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white max-w-5xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row md:items-end gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {restaurant.logoUrl && (
              <motion.div
                className="w-24 h-24 md:w-32 md:h-32 rounded-xl shadow-xl overflow-hidden border-2 border-white"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <img
                  src={restaurant.logoUrl}
                  alt={`${restaurant.name} logo`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
            <div className="flex-1">
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {restaurant.name}
              </motion.h1>
              <motion.div
                className="flex flex-wrap items-center text-sm md:text-base gap-x-6 gap-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Rating */}
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{restaurant.rating}</span>
                </span>
                {/* Cuisine */}
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{restaurant.cuisine}</span>
                </span>
                {/* Delivery Time */}
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <svg
                    className="w-4 h-4"
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
                  <span>{restaurant.deliveryTime} min</span>
                </span>
                {/* Delivery Fee */}
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <svg
                    className="w-4 h-4"
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
                  <span>${restaurant.deliveryFee} delivery</span>
                </span>
                {/* Order Now */}
                <motion.button
                  className="flex items-center gap-2 bg-primary px-4 py-2 rounded-full text-white font-medium shadow-lg hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Order Now
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* About & Menu Sections */}
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl mt-6">
        {/* About Restaurant */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8 md:mb-12 transform -translate-y-12 md:-translate-y-20 hover:shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M12 9.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
              />
            </svg>
            About Restaurant
          </h3>
          {restaurant.description && (
            <p className="text-gray-600 leading-relaxed">
              {restaurant.description}
            </p>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-x-12 gap-y-8 mt-12">
          {/* Sidebar Menu Nav */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-24 hover:shadow-md">
              <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Menu
              </h3>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => scrollToCategory(cat.id)}
                      className={`w-full text-left py-3 px-4 rounded-lg font-medium transition-all ${
                        activeCategory === cat.id
                          ? "bg-primary text-white shadow-md"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:w-3/4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                id={`category-${cat.id}`}
                className="mb-12 scroll-mt-24"
                ref={(el) => (sectionRefs.current[`category-${cat.id}`] = el)}
              >

                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {cat.name}
                  </h2>
                  <div className="h-px flex-grow bg-gray-200" />
                </div>
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                    viewMode === "list" ? "md:grid-cols-1" : ""
                  }`}
                >
                  {cat.items.map((item) => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      restaurantId={restaurant.id}
                      viewMode={viewMode}
                      restaurantName={restaurant.name}
                    />
                  ))}

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantPage;
