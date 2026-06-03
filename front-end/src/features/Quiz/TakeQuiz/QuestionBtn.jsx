import tw from "tailwind-styled-components";

const QuestionBtn = tw.button`
flex
items-center
justify-center
w-10
h-10
rounded-md
border
border-gray-300
text-sm
font-medium
transition
duration-200


${(p) => p.$correct && 'bg-green-600 text-white border-green-600 hover:bg-green-700'}
${(p) => p.$incorrect && 'bg-red-600 text-white border-red-600 hover:bg-red-700'}

${(p) => p.$answered && !p.$correct && !p.$incorrect && 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700'}

${(p) => p.$current && !p.$correct && !p.$incorrect && !p.$answered && 'bg-blue-700 text-white border-blue-700 hover:bg-blue-800'}
${(p) => !p.$current && !p.$answered && !p.$correct && !p.$incorrect && 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}
`;

export default QuestionBtn;