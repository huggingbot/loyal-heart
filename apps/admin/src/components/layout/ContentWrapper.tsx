import {
  DESKTOP_BODY_MAX_WIDTH,
  DESKTOP_PADDING_X,
  DESKTOP_PADDING_Y,
  MOBILE_PADDING_BOTTOM,
  MOBILE_PADDING_TOP,
  MOBILE_PADDING_X,
} from '../../constants/styles'

export const sharedContentWrapperStyle = `relative w-full max-w-[${DESKTOP_BODY_MAX_WIDTH + DESKTOP_PADDING_X * 2}px]`

export const sharedContentWrapperMargin = 'mt-3'

export const sharedContentWrapperXPadding = `px-[${DESKTOP_PADDING_X}px] sm:px-[${MOBILE_PADDING_X}px]`

export const sharedContentWrapperYPadding = `py-[${DESKTOP_PADDING_Y}px] sm:pt-[${MOBILE_PADDING_TOP}px] sm:pb-[${MOBILE_PADDING_BOTTOM}px]`

export const ContentWrapper = ({ children }: React.PropsWithChildren): JSX.Element => (
  <div
    className={`${sharedContentWrapperStyle} ${sharedContentWrapperMargin} ${sharedContentWrapperXPadding} ${sharedContentWrapperYPadding}`}
  >
    {children}a
  </div>
)
