
import Category from "../features/HomePage/Category/Category"
import Footer from "../features/HomePage/Footer"
import Header from "../features/HomePage/Header"
import HeroSection from "../features/HomePage/HeroSection"
import About from "../features/HomePage/About"

function MainPageLayout() {
  return (
    <>
       <Header/>
       <section id="hero-section">
       <HeroSection/>
       </section>
       
       <section id="category-section"> 
         <Category/>
       </section>
       
       <section id="about-section"> 
         <About/>
       </section>
      
       
     <Footer/>
    </>
  )
}

export default MainPageLayout