import { Link as ScrollLink } from 'react-scroll';
import tw from "tailwind-styled-components";

const StyledScrollLink = tw(ScrollLink)`
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
  cursor-pointer
  hover:bg-secondary-700
  hover:text-primary-400
`;


export default StyledScrollLink;