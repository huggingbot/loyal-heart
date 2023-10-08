import React from 'react'

import Medium from '../../text/Medium'

interface IInputProps extends React.HTMLAttributes<HTMLInputElement>, React.PropsWithChildren {}

const Input = ({ children }: IInputProps): JSX.Element => {
  return (
    <Medium className='border bg-white rounded text-gray-500 w-full height-[47px] box-border px-[10px] py-[16px] placeholder:text-gray-300, hover:border-gray-300 transition'>
      {children}
    </Medium>
  )
}

export default Input
