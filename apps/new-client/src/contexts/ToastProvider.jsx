import makeStyles from '@mui/styles/makeStyles'
import { SnackbarProvider } from 'notistack'

const useStyles = makeStyles(() => ({
  success: {
    border: '1px solid var(--green)',
    backgroundColor: 'var(--dark-2) !important',
  },
  error: {
    border: '1px solid var(--red)',
    backgroundColor: 'var(--dark-2) !important',
  },
  warning: {
    border: '1px solid var(--yellow)',
    backgroundColor: 'var(--dark-2) !important',
  },
  info: {
    border: '1px solid var(--blue)',
    backgroundColor: 'var(--dark-2) !important',
  },
}))

const ToastProvider = ({ children }) => {
  const classes = useStyles()

  console.log('TOIAST CLASSES', classes)

  return (
    <SnackbarProvider
      maxSnack="3"
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
      }}
    >
      {children}
    </SnackbarProvider>
  )
}

export default ToastProvider
