import ModalProvider from '../../contexts/ModalProvider'
import TabBar from '../TabBar/TabBar'
import css from './pagewrapper.module.css'
import { useLocation } from 'react-router-dom'

const ThothPageWrapper = ({ tabs, activeTab, ...props }) => {
  const location = useLocation()
  return (
    <ModalProvider>
      <div className={css['wrapper']}>
        {location.pathname.slice(1, 6) !== 'admin' && (
          <TabBar tabs={tabs} activeTab={activeTab} />
        )}
        {props.children}
      </div>
    </ModalProvider>
  )
}
export default ThothPageWrapper
