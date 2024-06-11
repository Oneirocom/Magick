import React, { useCallback } from 'react'
import { useModal } from '../../contexts/ModalProvider'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button } from '@magickml/client-ui'
import Image, { StaticImageData } from 'next/legacy/image'

const Modal = ({
  options,
  title,
  children,
  onClose,
  imagePath,
}: {
  title: string
  icon?: string
  options?: any[]
  className?: string
  children?: React.ReactNode
  onClose?: () => void
  imagePath?: string | StaticImageData
}) => {
  const { closeModal } = useModal()

  const handleModalBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      closeModal()
      if (onClose) onClose()
    },
    [closeModal, onClose]
  )

  const handleModalPanelClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const renderOptions = () => {
    return (
      options &&
      options.map(item => {
        if (item.component) {
          return item.component
        }
        return (
          <Button
            key={item.label}
            disabled={item.disabled || false}
            onClick={item.onClick}
            className={`${item.disabled && 'opacity-50 cursor-not-allowed'} ${
              item.className
            }`}
          >
            {item.label}
          </Button>
        )
      })
    )
  }

  const handleEnterPress = () => {
    const firstEnabledOption = options?.find(option => !option.disabled)
    if (firstEnabledOption) {
      firstEnabledOption.onClick()
    }
  }

  useHotkeys('escape', () => {
    closeModal()
    onClose && onClose()
  })
  useHotkeys('enter', handleEnterPress)

  return (
    <div
      className="text-white absolute flex items-center justify-center top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-[999] overflow-hidden"
      onClick={handleModalBackgroundClick}
    >
      <div
        className="p-4 bg-[#0b0d0e] rounded-md w-[calc(50%-4px)] animate-modal overflow-y-auto max-h-[calc(100vh-100px)] max-w-[calc(100vw-50%)]"
        onClick={handleModalPanelClick}
      >
        <div className="flex flex-col">
          <div className="flex">
            {imagePath && (
              <div className="w-1/2 p-2">
                <Image
                  src={imagePath}
                  alt="Treasure"
                  width={300}
                  height={300}
                />
              </div>
            )}
            <div className="w-1/2 flex flex-col justify-center ">
              <h1 className="text-2xl m-0 mb-4 font-bold">{title}</h1>
              {children}
            </div>
          </div>
        </div>
        <div className={`flex flex-row justify-end mt-4 mb-4 w-full `}>
          <Button
            className="mr-4 text-white bg-[#555c63] w-[100px] hover:bg-[#6b737a] transition duration-300"
            onClick={handleModalBackgroundClick}
          >
            Cancel
          </Button>
          {renderOptions()}
        </div>
      </div>
    </div>
  )
}

export default Modal
