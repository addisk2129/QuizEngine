

import tw from "tailwind-styled-components"

const Heading = tw.h1`
leading-[1.4]
${props => props.$type === "h1" && "text-white tracking-wide sm:text-4xl  text-3xl my-5 font-heading"}
${props => props.$type === "h2" && "text-white tracking-wide sm:text-3xl my-4 font-heading"}
${props => props.$type === "h3" && "text-white tracking-wide sm:text-2xl my-3 font-heading"}
`

export default Heading