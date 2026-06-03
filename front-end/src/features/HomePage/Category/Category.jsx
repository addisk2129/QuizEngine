import CategoryNavBar from "./CategoryNavBar";
import QuizList from "./QuizList";

function Category() {
  return (
    <section className="bg-gray-50 px-4 sm:px-6 md:px-10 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-700 font-heading">
            Explore Quizzes by Category
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Pick a category and start testing your knowledge
          </p>
        </div>

        {/* Sticky Category Filter Bar */}
        <div className="sticky top-14 z-20 bg-gray-50 py-2">
          <CategoryNavBar />
        </div>

        {/* Quiz Cards Grid */}
        <QuizList />

      </div>
    </section>
  );
}

export default Category;