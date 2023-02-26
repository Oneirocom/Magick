import * as React from 'react'
import Box from '@mui/material/Box'
const style = {
  color: 'white',
  border: 1,
  borderRadius: '16px',
  borderRepeat: 'no-repeat',
  width: 'calc(100%-32px)',
  padding: '16px',
  marginTop: '16px',
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
