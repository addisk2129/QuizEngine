
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import heroImage from './heroImage';
import { FaCircle } from "react-icons/fa";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] md:min-h-screen w-full flex items-center overflow-hidden bg-[#0b0412]">
      
      {/* Background Full-Screen Swiper Slider */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          className="w-full h-full"
        >
          {heroImage.map((img, index) => (
            <SwiperSlide key={index} className="w-full h-full relative">
              <img
                src={img}
                alt={`Hero background slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay Gradient for Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0412]/90 via-[#0b0412]/60 to-transparent sm:bg-black/40"></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Decorative Blob */}
      <div className="absolute top-[20%] right-[10%] w-6 h-6 bg-[#b01e53] rounded-full opacity-60 z-10 blur-[1px]"></div>

      {/* Foreground Content Wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 pt-24 pb-16 flex flex-col justify-center items-start text-left">
        <div className="max-w-2xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.1] font-heading tracking-tight drop-shadow-2xl">
            Test Your <br />
            Knowledge &<br />
            Level Up
          </h1>

          <p className="text-gray-200 tracking-wide mt-6 mb-10 text-base md:text-xl leading-relaxed drop-shadow-lg font-medium font-body bg-black/30 md:bg-transparent p-3 md:p-0 rounded-lg backdrop-blur-sm md:backdrop-blur-none inline-block">
            Join thousands of learners expanding their minds daily. Explore diverse topics, track your progress, and challenge friends.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-3 bg-[#b01e53] hover:bg-[#8e1641] text-white font-bold py-3 md:py-4 px-8 md:px-10 text-base md:text-lg rounded-full transition-all duration-300 shadow-xl shadow-[#b01e53]/30 uppercase tracking-wide group"
          >
            <FaCircle className="text-white text-[10px] group-hover:scale-150 transition-transform duration-300" />
            GET STARTED
          </button>
        </div>
      </div>

    </section>
  );
}

export default HeroSection;