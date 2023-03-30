// GENERATED 
/**
 * Main layout component.
 * Renders a Drawer component with the Outlet component inside, wrapped in ModalProvider.
 */
import { Outlet } from 'react-router-dom';
import ModalProvider from '../../contexts/ModalProvider';
import { Drawer } from '@magickml/client-core';

/**
 * Main layout component.
 * Renders a Drawer component with the Outlet component inside, wrapped in ModalProvider.
 * @returns {JSX.Element} The MainLayout component
 */
const MainLayout = (): JSX.Element => {
  return (
    <ModalProvider>
      <Drawer>
        <Outlet />
      </Drawer>
    </ModalProvider>
  );
};

export default MainLayout;