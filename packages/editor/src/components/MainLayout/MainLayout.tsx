import { Outlet } from 'react-router-dom'

import ModalProvider from '../../contexts/ModalProvider'
import Drawer from '../Drawer/Drawer'

const MainLayout = () => {
  return (
    <ModalProvider>
      <Drawer>
        <Outlet />
      </Drawer>
    </ModalProvider>
  )
}

export default MainLayout
