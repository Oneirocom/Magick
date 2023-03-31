// DOCUMENTED 
/**
 * This component is responsible to render the page for creating a new fine tune.
 * It wraps the NewFineTuneForm component into a LoginRequired component to ensure the user has permission.
 */

import React from 'react';
import LoginRequired from '../account/LoginRequired';
import NewFineTuneForm from '../fine-tunes/NewFineTuneForm';

export default function NewFineTunePage(): JSX.Element {
  return (
    <LoginRequired>
      <NewFineTuneForm />
    </LoginRequired>
  );
}