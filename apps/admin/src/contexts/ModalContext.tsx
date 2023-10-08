import React, { createContext, ReactElement, useCallback, useContext, useState } from 'react'

type Handler = () => void

export interface InjectedProps {
  onDismissModal?: Handler
}

interface IModalContext extends Required<InjectedProps> {
  isModalOpen: boolean
  onShowModal: (elem: React.ReactElement, shouldCloseOnOverlayClick: boolean) => void
}

interface IProvideModal extends IModalContext {
  modalElem?: React.ReactElement
  onOverlayClick: () => void
}

interface IModal extends Omit<IModalContext, 'onShowModal'> {
  onShowModal: () => void
}

const modalContext = createContext<IModalContext>({
  isModalOpen: false,
  onShowModal: () => undefined,
  onDismissModal: () => undefined,
})

const useProvideModal = (): IProvideModal => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalElem, setModalElem] = useState<React.ReactElement>()
  const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true)

  const onShowModal = (modelEl: React.ReactElement, shouldCloseOnOverlayClick: boolean): void => {
    if (document.activeElement && typeof (document.activeElement as HTMLElement).blur === 'function') {
      ;(document.activeElement as HTMLElement).blur()
    }
    setModalElem(modelEl)
    setCloseOnOverlayClick(shouldCloseOnOverlayClick)
    setIsModalOpen(true)
  }

  const onDismissModal = (): void => {
    setModalElem(undefined)
    setIsModalOpen(false)
  }

  const onOverlayClick = (): void => {
    if (closeOnOverlayClick) {
      onDismissModal()
    }
  }

  return {
    isModalOpen,
    modalElem,
    onShowModal,
    onDismissModal,
    onOverlayClick,
  }
}

export const ModalProvider = ({ children }: React.PropsWithChildren): JSX.Element => {
  const { isModalOpen, modalElem, onShowModal, onDismissModal, onOverlayClick } = useProvideModal()

  return (
    <modalContext.Provider
      value={{
        isModalOpen,
        onShowModal,
        onDismissModal,
      }}
    >
      {isModalOpen && (
        <div className='fixed top-0 right-0 bottom-0 left-0 flex flex-col justify-center items-center z-10'>
          <div
            className='fixed top-0 left-0 w-full h-full bg-gray-800 transition-opacity z-10 opacity-30 pointer-events-auto'
            onClick={onOverlayClick}
          />
          {React.isValidElement(modalElem) &&
            React.cloneElement<{ onDismissModal: () => void }>(
              modalElem as ReactElement<{ onDismissModal: () => void }>,
              {
                onDismissModal,
              },
            )}
        </div>
      )}
      {children}
    </modalContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = (modal: React.ReactElement, closeOnOverlayClick = true): IModal => {
  const { isModalOpen, onShowModal: onShowModalContext, onDismissModal } = useContext(modalContext)

  const onShowModal = useCallback(() => {
    onShowModalContext(modal, closeOnOverlayClick)
  }, [modal, closeOnOverlayClick, onShowModalContext])

  return { isModalOpen, onShowModal, onDismissModal }
}
