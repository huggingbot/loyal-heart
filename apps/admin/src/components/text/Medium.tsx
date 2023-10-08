interface IMediumProps extends React.HTMLAttributes<HTMLSpanElement>, React.PropsWithChildren {}

const Medium = ({ children, ...props }: IMediumProps): JSX.Element => {
  return (
    <span className={`text-grey-500 not-italic font-normal text-base`} {...props}>
      {children}
    </span>
  )
}

export default Medium
