// DOCUMENTED 
/**
 * Imports React and the Outlet component from react-router-dom.
 * Imports the NavBar component and the CSS module for the page wrapper.
 */
import * as React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../components/NavBar'
import css from './pagewrapper.module.css'

/**
 * @description Functional component that returns a wrapper for the FineTuneManager page.
 * The wrapper includes a NavBar and a React Router Outlet component.
 * @returns JSX.Element
 */
const FineTuneManagerWrapper = (): JSX.Element => {
  return (
    <div className={css.wrapper}>
      <NavBar />
      <Outlet />
    </div>
  )
}

// Exports the FineTuneManagerWrapper component as the default export.
export default FineTuneManagerWrapper