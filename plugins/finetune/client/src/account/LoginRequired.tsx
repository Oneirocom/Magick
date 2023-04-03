// DOCUMENTED 
/**
 * LoginRequired component requires that the user is authenticated before accessing the children prop.
 * If the user is authenticated, the children will be rendered, otherwise the user will be redirected to HomePage.
 * @param children - JSX elements to be rendered.
 */
import React from 'react';
import HomePage from '../screens/Home';
import useAuthentication from './useAuthentication';

export default function LoginRequired({ children }: { children: React.ReactNode }): JSX.Element {
  const { headers } = useAuthentication();
  return headers ? <>{children}</> : <HomePage />;
}