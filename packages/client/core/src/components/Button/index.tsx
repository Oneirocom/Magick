import React, { ButtonHTMLAttributes, ReactNode, useState, MouseEvent, CSSProperties } from 'react';
// import styles from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  hoverStyle?: React.CSSProperties;
}


/**
 * Button component with hover style support.
 *
 * @param {object} props - The component properties.
 */
export const Button = ({
  onClick,
  className,
  children,
  hoverStyle,
  disabled,
  style,
  ...props
}: ButtonProps): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);

  const disabledStyle: React.CSSProperties = {
    backgroundColor: '#3c3c3cba', // Grey background
    color: '#909090', // Darker grey text
    cursor: 'not-allowed',
    filter: 'none',
  };


  // Function to merge styles
  const getButtonStyle = (): CSSProperties | undefined => {
    if (disabled) {
      return { ...style, ...disabledStyle };
    }
    if (isHovered && hoverStyle) {
      return { ...style, ...hoverStyle };
    }
    return style;
  };

  return (
    // Render a button with the provided onClick handler and spread props
    <button
      onClick={onClick}
      className={className}
      disabled={disabled}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      style={getButtonStyle()}
      {...props}
    >
      {children}
    </button>
  )
}
