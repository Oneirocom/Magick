import { SnackbarProvider } from 'notistack'

const styles = () => ({
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
})

// {
//   variantSuccess: classes.success,
//   variantError: classes.error,
//   variantWarning: classes.warning,
//   variantInfo: classes.info,
// }

const ToastProvider = ({ children }) => {
  return <SnackbarProvider maxSnack="3">{children}</SnackbarProvider>
}

export default ToastProvider
