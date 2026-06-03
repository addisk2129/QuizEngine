import { useState, useEffect } from "react";
import { setCurrentCategory } from "../../Quiz/QuizSlice";
import { useDispatch, useSelector } from "react-redux";
import axiosPublic from "../../../utils/axiosPublic";

function CategoryNavBar() {
  const dispatch = useDispatch();
  const { category } = useSelector((store) => store.quizz);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosPublic.get("/categories");
        setCategories(response.data.data.allCategory);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleClick = (current) => {
    dispatch(setCurrentCategory(current));
  };

  const allItems = [{ _id: "all", name: "All" }, ...categories];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <ul className="flex items-center gap-2 py-2 px-1 min-w-max">
        {allItems.map((cat) => {
          const isActive = category === cat._id;
          return (
            <li key={cat._id}>
              <button
                onClick={() => handleClick(cat._id)}
                className={`
                  whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium
                  border transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary-400 hover:text-primary-600"
                  }
                `}
              >
                {cat.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CategoryNavBar;