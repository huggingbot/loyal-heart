import React from 'react'

interface ISelectProps extends React.HTMLAttributes<HTMLSelectElement> {
  options?: { value: string | number; label: string }[]
}

export const Select = React.forwardRef<HTMLSelectElement, ISelectProps>((props, ref): JSX.Element => {
  return (
    <select
      ref={ref}
      className={`block mt-2 w-full placeholder-gray-400/70 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40
    appearance-none bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-[url('icons/DropdownIcon.svg')] bg-no-repeat`}
      {...props}
    >
      <option value=''>Please select</option>
      {props.options?.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
})
