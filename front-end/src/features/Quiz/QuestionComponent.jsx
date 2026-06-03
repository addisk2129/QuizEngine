import tw from "tailwind-styled-components";

export const Container = tw.div`
w-full
mx-auto
bg-white
border
border-gray-200
rounded-xl
shadow-sm
flex
flex-col
min-h-[60vh]
`;
/* ================= HEADER ================= */
export const Header = tw.div`
flex
items-center
justify-between
px-4 sm:px-6
py-3
border-b
border-gray-200
text-sm sm:text-base
font-heading
text-gray-700
`;

/* ================= CONTENT ================= */
export const Content = tw.div`
flex-1
overflow-y-auto
px-4 sm:px-6
py-4
flex
flex-col
gap-4
`;

/* ================= FOOTER ================= */
export const Footer = tw.div`
flex
flex-col sm:flex-row
items-center
justify-between
gap-3
px-4 sm:px-6
py-3
border-t
border-gray-200
`;

/* ================= QUESTION ================= */
export const QuestionText = tw.p`
text-base sm:text-lg
leading-relaxed
font-heading
text-gray-800
`;

/* ================= OPTIONS ================= */
export const Options = tw.div`
flex
flex-col
gap-2
mt-2
`;

export const Option = tw.label`
flex
items-center
gap-3
p-3 sm:p-4
border
border-gray-200
rounded-lg
cursor-pointer
text-sm sm:text-base
transition-all
duration-200

hover:border-primary-500
hover:bg-primary-50

${(p) => p.$selected && `
  border-primary-600 
  bg-primary-50
`}
`;

/* ================= STATUS BADGE ================= */
export const StyledParag = tw.p`
px-2 py-1
rounded-full
text-xs
font-medium

${(p) => {
  if (p.$correct === true) return "bg-green-100 text-green-700";
  if (p.$correct === false) return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-500";
}}
`;

/* ================= FILTER BUTTON ================= */
export const FilterButton = tw.button`
px-3 py-1
text-sm
rounded-md
bg-gray-100
hover:bg-gray-200
transition

${(p) => p.$active && "bg-primary-600 text-white hover:bg-primary-700"}
`;