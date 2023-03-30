// GENERATED 
import * as React from 'react';
import css from './TabLayout.module.css';

/**
 * TabLayout component that wraps children in a styled container.
 *
 * @param {React.ReactNode} children - The child components to be wrapped.
 * @returns {JSX.Element} A styled container with the children.
 */
export const TabLayout: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
  return (
    <div className={css['view-container']}>
      {/* Child components are wrapped in a relatively positioned div */}
      <div style={{ position: 'relative', height: '100%' }}>{children}</div>
    </div>
  );
};