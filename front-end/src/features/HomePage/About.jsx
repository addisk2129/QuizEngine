
import Heading from "../../ui/Heading";
import { FaBullseye, FaChartLine, FaTrophy } from "react-icons/fa";

const stats = [
  { value: "44M+", label: "Quiz Attempts" },
  { value: "120K+", label: "Active Learners" },
  { value: "5,000+", label: "Quizzes Available" },
];

function About() {
  return (
    <section className="text-white bg-secondary-800 px-4 sm:px-8 lg:px-16 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">

        {/* Main grid: text + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">

          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading">
              Our Mission
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed tracking-wide">
              We believe learning should be engaging, accessible, and fun.
              QuizMaster brings together learners and educators to create a
              world-class quiz experience on any topic imaginable.
            </p>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed tracking-wide">
              Whether you're preparing for an exam, brushing up on a skill, or
              just exploring new topics — we have quizzes for everyone. Track
              your progress, compete with friends, and earn your way to the top
              of the leaderboard.
            </p>
          </div>

          {/* RIGHT STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition"
              >
                <p className="text-3xl sm:text-4xl font-bold text-primary-400 font-heading">
                  {value}
                </p>
                <p className="text-gray-400 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { icon: <FaBullseye />, title: "Instant Feedback", desc: "Get results immediately after each quiz attempt." },
            { icon: <FaChartLine />, title: "Progress Tracking", desc: "Monitor your improvement over time with detailed stats." },
            { icon: <FaTrophy />, title: "Leaderboards", desc: "Compete with learners worldwide and rise to the top." },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
            >
              <div className="text-3xl mb-3 text-primary-400">{icon}</div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default About;