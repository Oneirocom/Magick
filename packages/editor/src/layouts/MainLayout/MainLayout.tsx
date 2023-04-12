// DOCUMENTED
/**
 * Main layout component.
 * Renders a Drawer component with the Outlet component inside, wrapped in ModalProvider.
 */
import { Outlet } from 'react-router-dom'
import ModalProvider from '../../contexts/ModalProvider'
import { DrawerProvider } from '@magickml/client-core'

/**
 * Main layout component.
 * Renders a Drawer component with the Outlet component inside, wrapped in ModalProvider.
 * @returns {JSX.Element} The MainLayout component
 */
const MainLayout = (): JSX.Element => {
  return (
    <ModalProvider>
      <DrawerProvider>
        <Outlet />
      </DrawerProvider>
    </ModalProvider>
  )
}

export default MainLayout
