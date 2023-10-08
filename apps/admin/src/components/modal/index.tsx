import React, { useEffect } from 'react'

import { InjectedProps } from '../../contexts/ModalContext'

// eslint-disable-next-line react-refresh/only-export-components
export enum EBaseModalSize {
  Large = 'large',
  Small = 'small',
}
interface IBaseModalProps extends InjectedProps, React.PropsWithChildren {
  modalSize?: EBaseModalSize
  title: string
  hideCloseButton?: boolean
  icon?: React.ReactNode
  id?: string
  isShownOnFormLoad?: boolean
}

const BaseModal: React.FC<IBaseModalProps> = props => {
  // onDismissModal is required in modal context
  const {
    id = 'modal',
    modalSize = EBaseModalSize.Small,
    title,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDismissModal = (): void => undefined,
    children,
    icon,
    isShownOnFormLoad = false,
  } = props

  // disable background scrolling when rendering modal while retaining positioning of elements
  useEffect(() => {
    if (isShownOnFormLoad) {
      // force scrollbar to appear for the first modal on form load, then properly calculate its width
      // first modal will appear before scrollbar does, and the calculated scrollbar width will be 0
      // when modal is dismissed, scrollbar will reappear, causing compoonents to move slightly to the left
      // subsequent modals won't suffer from this issue
      document.body.style.overflow = 'scroll'
    }
    const onTouchmove = (e: TouchEvent): void => {
      e.preventDefault()
    }
    const verticalScrollbarWidth = window.innerWidth - document.body.clientWidth
    document.body.style.marginRight = `${verticalScrollbarWidth}px`
    document.body.style.overflow = 'hidden'
    document.body.addEventListener('touchmove', onTouchmove, { passive: false })

    return () => {
      // enable scrolling when closing modal
      document.body.style.marginRight = 'unset'
      document.body.style.overflow = 'unset'
      document.body.removeEventListener('touchmove', onTouchmove)
    }
  }, [isShownOnFormLoad])

  return (
    <div
      id={id}
      role='alertdialog'
      aria-modal={true}
      aria-labelledby={`${id}-title`}
      className={`bg-white shadow-modal border border-gray-5 rounded-md p-8 overflow-y-auto z-10 ${
        modalSize === EBaseModalSize.Large ? 'min-w-[416px] max-w-[636px] w-[44%]' : 'w-[416px]'
      }`}
    >
      <div className={`flex`}>
        {icon ? <div className={`mt-5`}>{icon}</div> : null}
        <h5 id={`${id}-title`} className={`ml-4 text-gray-900`}>
          {title}
        </h5>
      </div>
      <div className={`flex flex-col mt-2 text-gray-900`}>{children}</div>
    </div>
  )
}

export default BaseModal
