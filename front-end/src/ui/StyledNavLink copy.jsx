import { NavLink } from "react-router-dom";
import tw from "tailwind-styled-components";

const StyledNavLink = tw(NavLink)`
  flex
  items-center
  gap-3
  px-2
  py-2
  text-base
  font-medium
  rounded-md
  no-underline
  transition-all
  duration-300
  text-white
  font-heading

  hover:bg-secondary-700
  hover:text-primary-400
  

  

`;


export default StyledNavLink;