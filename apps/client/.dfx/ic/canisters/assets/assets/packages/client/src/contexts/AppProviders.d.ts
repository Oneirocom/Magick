import { Theme } from '@mui/material/styles';
declare module '@mui/styles/defaultTheme' {
    interface DefaultTheme extends Theme {
    }
}
declare const AppProviders: ({ children }: {
    children: any;
}) => JSX.Element;
export default AppProviders;
