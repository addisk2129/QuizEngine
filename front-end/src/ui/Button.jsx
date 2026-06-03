import tw from "tailwind-styled-components";

const sizes = {
  small: "text-sm px-3 py-1.5",
  medium: "text-base px-4 py-2",
  large: "text-lg px-6 py-3",
};

const variations = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-900",

  secondary:
    "bg-gray-100 text-gray-700 hover:bg-gray-200",

  danger:
    "bg-red-800 text-white hover:bg-red-700",
};

const Button = tw.button`
border-none
rounded-md
font-medium
transition-all
disabled:opacity-50
${(props) => sizes[props.$size || "medium"]}
${(props) => variations[props.$variation || "primary"]}
`;

export default Button;