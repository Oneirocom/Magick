// DOCUMENTED 
/**
 * @module NavBar
 **/

import React from 'react';
import css from './tabBar.module.css';
import Button from '@mui/material/Button';
import useAuthentication from '../../account/useAuthentication';
import { useNavigate } from 'react-router-dom';

/**
 * Navigation bar component
 *
 * @returns Navigation bar
 */
const NavBar: React.FC = (): JSX.Element => {
  const { isSignedIn, signOut } = useAuthentication();
  const navigate = useNavigate();

  /**
   * Renders Navigation bar component
   *
   * @returns Navigation bar
   */
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
  );
};

export default NavBar;