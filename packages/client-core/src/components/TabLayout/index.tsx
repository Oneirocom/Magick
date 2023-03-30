// GENERATED 
/**
 * This component defines the layout of the tabs.
 * It takes a single children property, which represents the content to be displayed in the tab.
 */

import React, { ReactNode } from 'react';
import css from './TabLayout.module.css';

interface Props {
  children: ReactNode;
}

export const TabLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <>
      <div className={css.viewContainer}>
        <div style={{ position: 'relative', height: '100%' }}>{children}</div>
      </div>
    </>
  );
};

/**
 * Props interface defines the properties that are passed to the component.
 * It includes a single property children, which is ReactNode.
 *
 * TabLayout component is a function component that takes Props interface as a generic type.
 * TabLayout contains a div element to display the children.
 */