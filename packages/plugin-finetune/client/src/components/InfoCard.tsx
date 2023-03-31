// DOCUMENTED 
/**
 * This component represents an information card that displays content with a styled background color.
 * @param children The content to be displayed inside the card.
 * @returns A React component that displays the provided content inside a dark background colored card.
 */

import React from 'react';
import Box from '@mui/material/Box';

/**
 * The style object for the InfoCard component.
 */
const CARD_STYLE = {
  color: 'white',
  width: 'calc(100% - 32px)',
  backgroundColor: '#222',
  padding: '1em',
  marginTop: '1em',
  marginLeft: 'auto',
  marginRight: 'auto',
};

/**
 * Renders an information card with the provided content.
 * @param children The content to be displayed inside the card.
 * @returns A React component that displays the provided content inside a dark background colored card.
 */
export default function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <Box component={'div'} sx={CARD_STYLE}>
      {children}
    </Box>
  );
}