// DOCUMENTED 
import { Box, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

import ErrorMessage from './ErrorMessage';

/**
 * Details Page Component
 * @param {string} id - The id of the item being displayed
 * @param {string} name - The name of the item being displayed
 * @param {Error} [error] - An optional error object 
 * @param {React.ReactNode} children - The child components to be displayed inside the main element
 */
export default function DetailsPage({
  id,
  name,
  error,
  children,
}: {
  id: string;
  name: string;
  error?: Error;
  children: ReactNode;
}) {
  return (
    <main>
      {/* TODO @thomageanderson: remove hardcoded color when global mui themes are supported */}

      {/* Box component */}
      <Box component='span' sx={{ textAlign: 'center' }}>
        {/* Typography component */}
        <Typography variant='h4' component='h2' color='white'>
          {/* Title */}
          {name} {id}
        </Typography>
      </Box>

      {/* Display error message if error exists */}
      {error && <ErrorMessage error={error} />}

      {/* Display child components */}
      {children}
    </main>
  );
}