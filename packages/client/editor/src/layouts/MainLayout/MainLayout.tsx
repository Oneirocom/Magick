// DOCUMENTED
/**
 * Main layout component.
 * Renders a Drawer component with the Outlet component inside, wrapped in ModalProvider.
 */
import { Outlet } from 'react-router-dom'
import ModalProvider from '../../contexts/ModalProvider'
import { DrawerProvider } from 'client/core'
import { TreeDataProvider } from '@magickml/providers'

/**
 * Main layout component.
 * Renders a Drawer component with the Outlet component inside, wrapped in ModalProvider.
 * @returns {JSX.Element} The MainLayout component
 */
const MainLayout = (): JSX.Element => {
  return (
    <ModalProvider>
      <TreeDataProvider>
        <DrawerProvider>
          <Outlet />
        </DrawerProvider>
      </TreeDataProvider>
    </ModalProvider>
  )
}

export default MainLayout
