import { Outlet } from 'react-router-dom'

import NavBar from '../components/NavBar'
import css from './pagewrapper.module.css'

const FineTuneManagerWrapper = () => {
  return (
    <div className={css['wrapper']}>
      <NavBar />
      <Outlet />
    </div>
  )
}
export default FineTuneManagerWrapper
