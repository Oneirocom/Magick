// DOCUMENTED 
/**
 * Returns the authentication context for the AccountContext
 * @returns {Object} AccountContext - Object containing the authentication context
 */

import { useContext } from 'react';
import { AccountContext } from './Account';

export default function useAuthentication() {
  return useContext(AccountContext);
}