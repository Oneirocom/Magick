import * as React from 'react'
import Box from '@mui/material/Box'
const style = {
  color: 'white',
  width: 'calc(100%-32px)',
  backgroundColor: '#222',
  padding: '1em',
  marginTop: '1em',
  marginLeft: 'auto',
  marginRight: 'auto',
}
export default function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <Box component={'div'} sx={style}>
      {children}
    </Box>
  )
}
