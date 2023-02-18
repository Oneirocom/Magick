import css from './tabBar.module.css'
import { VscAdd } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'

const CreateTab = () => {
  const navigate = useNavigate()

  const onCreate = () => {
    navigate('/home/create-new')
  }

  return (
    <div
      className={`${css['tabbar-tab']} ${css['create-spell-tab']}`}
      onClick={onCreate}
    >
      <span>
        <VscAdd />
      </span>
    </div>
  )
}

export default CreateTab
