import { Link } from "react-router-dom";

const CategoryPill = ({ category, isActive, onClick, basePath = "/" }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  return (
    <Link
      to={`${basePath}?cuisine=${category.slug}`}
      onClick={handleClick}
      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
        isActive
          ? "bg-primary text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {category.name}
    </Link>
  );
};

export default CategoryPill;