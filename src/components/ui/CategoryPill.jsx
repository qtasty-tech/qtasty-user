
import { Link } from 'react-router-dom';

const CategoryPill = ({ category, isActive }) => {
  return (
    <Link 
      to={`/?category=${category.slug}`}
      className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
        isActive 
          ? 'bg-primary text-white' 
          : 'bg-white border border-gray-200 text-supportive hover:bg-gray-50'
      }`}
    >
      {category.name}
    </Link>
  );
};

export default CategoryPill;
