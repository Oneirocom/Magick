import MagickLogo from './Magick-purple-logo.png'
import css from './tabBar.module.css'
import Button from '@mui/material/Button'
import useAuthentication from '../../account/useAuthentication'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
  const { isSignedIn, signOut } = useAuthentication()
  const navigate = useNavigate()
  return (
    <div className={css['th-tabbar']}>
      {isSignedIn && (
        <div className={css['tabbar-section']}>
          <Button onClick={() => navigate('/fineTuneManager/completions')}>
            Completions
          </Button>
          <Button onClick={() => signOut()}>Clear Credentials</Button>
        </div>
      )}
    </div>
  )
}

export default NavBar
