// DOCUMENTED
/**
 * Import necessary dependencies and modules
 */
import css from './tabBar.module.css'
import { VscAdd } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'

/**
 * CreateTab Function
 * @returns a JSX.Element containing the element for the CreateTab component
 */
const CreateTab = (): JSX.Element => {
  /**
   * Define a constant variable navigate that will be used to call the useNavigate hook
   */
  const navigate = useNavigate()

  /**
   * Define a function that navigates or redirects the user to the '/home/create-new' url path
   */
  const onCreate = (): void => {
    navigate('/home/create-new')
  }

  /**
   * Render the CreateTab component containing a div element with className of 'tabbar-tab' and 'create-spell-tab'
   * along with a VscAdd icon element
   */
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

/**
 * Export the CreateTab component as default
 */
export default CreateTab
