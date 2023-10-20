// DOCUMENTED
import { SnackbarProvider } from 'notistack'

// /**
//  * Styles for snackbars with success, error, warning, and info variant
//  *
//  * @returns {Object} The style object for snackbars
//  */
// const styles = () => ({
//   success: {
//     border: '1px solid var(--green)',
//     backgroundColor: 'var(--dark-2) !important',
//   },
//   error: {
//     border: '1px solid var(--red)',
//     backgroundColor: 'var(--dark-2) !important',
//   },
//   warning: {
//     border: '1px solid var(--yellow)',
//     backgroundColor: 'var(--dark-2) !important',
//   },
//   info: {
//     border: '1px solid var(--blue)',
//     backgroundColor: 'var(--dark-2) !important',
//   },
// });

/* 
Map of style variants for SnackbarProvider component is commented
out but can be utilized if desired.
{
  variantSuccess: classes.success,
  variantError: classes.error,
  variantWarning: classes.warning,
  variantInfo: classes.info,
}
*/

/**
 * ToastProvider component
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Children components
 * @returns {React.Element} The ToastProvider component within SnackbarProvider
 */
const ToastProvider = ({ children }) => {
  return <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}>{children}</SnackbarProvider>
}

// Export ToastProvider component as default
export default ToastProvider
