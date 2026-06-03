import tw from "tailwind-styled-components";

const StyledList = tw.li`
relative
cursor-pointer
px-2
py-1
text-gray-700
font-semibold
transition-colors
duration-300

hover:text-primary-600

after:absolute
after:left-0
after:-bottom-1
after:h-[3px]
after:w-full
after:bg-primary-500

after:scale-x-0
after:origin-left

after:transition-transform
after:duration-300

hover:after:scale-x-100
`;

export default StyledList;