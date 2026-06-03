import tw from 'tailwind-styled-components'
const ButtonIcon = tw.button`
  bg-transparent
  border-none
  p-[0.6rem]
  rounded-md
  transition-all
  duration-200
  cursor-pointer
  flex
  items-center
  justify-center
  bg-gray-400
  & svg {
    width: 2.2rem;
    height: 2.2rem;
    color: var(--color-grey-600);
    transition: all 0.2s;
  }

  &:hover {
    background-color: var(--color-primary-100);
    
    svg {
      color: var(--color-brand-600);
    }
  }
`;

export default ButtonIcon;