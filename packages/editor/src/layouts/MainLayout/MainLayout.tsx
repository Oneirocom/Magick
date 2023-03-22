import { Outlet } from 'react-router-dom'

import ModalProvider from '../../contexts/ModalProvider'
import { Drawer } from '@magickml/client-core'

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
