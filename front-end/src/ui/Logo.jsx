import logo from "../assets/logo.png";
import StyledNavLink from "./StyledScrollLink";

function Logo() {
  return (
   
 <div className="bg-red-500">
<img
      src={logo}
      alt="QuizEngine Logo"
      className="  h-[4rem] left-0 top-0 w-auto object-cover absolute"
    /> 
 </div>
  );
}

export default Logo;