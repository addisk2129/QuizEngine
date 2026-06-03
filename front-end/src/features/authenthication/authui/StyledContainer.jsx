import React from 'react'
import tw from 'tailwind-styled-components'

export const StyledAuthPage =tw.div`
min-h-screen
bg-gradient-to-br 
from-secondary-700 
to-secondary-500 
flex flex-col items-center 
justify-center px-4
`
export const HigherContainer = tw.div`
w-full max-w-md
`

export const StyledContainer = tw.div`
bg-white/10 
backdrop-blur-lg 
rounded-2xl p-8 shadow-2xl
`

export const LabelInput = tw.div`
flex 
flex-col
 gap-1.5
`


export const StyledForm = tw.form`
flex flex-col gap-5
`

export const AccountText = tw.p`
text-center text-sm  mt-4
`

export const SingInSingnUpBtn = tw.button`

font-medium transition-colors
`