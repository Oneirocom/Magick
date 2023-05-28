// DOCUMENTED 
/**
 * The CompletionsPage component renders the CompletionList component within a LoginRequired component.
 * This ensures that the user is authenticated before being able to view the completion list.
 */

import React from 'react';
import LoginRequired from '../account/LoginRequired';
import CompletionList from './CompletionList';

/**
 * CompletionsPage component.
 * @returns {JSX.Element} JSX element with LoginRequired and CompletionList components.
 */
export default function CompletionsPage(): JSX.Element {
  return (
    <LoginRequired>
      <CompletionList />
    </LoginRequired>
  );
}