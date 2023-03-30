// GENERATED 
import * as React from 'react';

import css from './toolbar.module.css';

/**
 * Toolbar component that receives toolbar and options as props and renders them inside
 * two 'toolbar-section' divs.
 *
 * @param props - An object containing 'toolbar' and 'options' components.
 * @returns A JSX element representing the toolbar.
 */
export const Toolbar = ({ ...props }) => {
  // Return the toolbar wrapped in two divs with appropriate classNames.
  return (
    <div className={css['th-toolbar']}>
      {/* Render the toolbar in the first 'toolbar-section' div. */}
      <div className={css['toolbar-section']}>{props.toolbar}</div>
      {/* Render the options in the second 'toolbar-section' div. */}
      <div className={css['toolbar-section']}>{props.options}</div>
    </div>
  );
};