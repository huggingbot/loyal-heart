import { useCallback, useEffect, useState } from 'react'

import BaseModal, { EBaseModalSize } from '..'

export interface IFormModal {
  modalSize?: EBaseModalSize
  title: string
}

interface IProps extends React.PropsWithChildren {
  onDismissModal?: () => void
  modalSize?: EBaseModalSize
  title: string
  icon?: React.ReactNode
  onActionButtonClick?: () => void
}

const FormModal: React.FC<IProps> = ({ children, onDismissModal, modalSize, title, icon, onActionButtonClick }) => {
  const [actionExecuted, setActionExecuted] = useState<boolean>(false)

  const handleOnClick = useCallback(() => {
    setActionExecuted(true)

    onActionButtonClick?.()

    onDismissModal?.()
  }, [onDismissModal, onActionButtonClick])

  useEffect(() => {
    return () => {
      if (!actionExecuted && onActionButtonClick) {
        onActionButtonClick()
      }
    }
  }, [actionExecuted, onActionButtonClick])

  return (
    <BaseModal title={title} onDismissModal={handleOnClick} icon={icon} modalSize={modalSize} isShownOnFormLoad>
      {children}
    </BaseModal>
  )
}

export default FormModal
