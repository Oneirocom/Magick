// GENERATED 

import * as React from 'react'
import IconButton from '@mui/material/IconButton'

/**
 * The Props object contains the properties that can be set for the IconBtn component.
 * 
 * @interface Props
 * @property {React.ReactNode} Icon - The icon component to be rendered inside the IconButton.
 * @property {string} label - The label for the IconButton component.
 * @property {(e?) => void} onClick - A function that is executed when the IconButton is clicked.
 * @property {object} [style] - An optional style object to be used for the IconButton component.
 */
interface Props {
  Icon: React.ReactNode;
  label: string;
  onClick?: (e?) => void;
  style?: object;
}

/**
 * The IconBtn React component is a wrapper around the Material UI IconButton component,
 * with additional props that allow for an icon, label, and onClick handler to be included.
 * 
 * @param {Props} props - The properties that can be set for the IconBtn component.
 */
 export const IconBtn = (props: Props) => {
  return (
    <IconButton
      color="inherit"
      aria-label={props.label}
      component="label"
      onClick={props.onClick}
      style={props.style}
    >
      {props.Icon}
    </IconButton>
  );
}