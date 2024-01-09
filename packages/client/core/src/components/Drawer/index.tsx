// DOCUMENTED
import { ProjectWindowProvider } from '@magickml/providers'
import { OldSidebar } from './OldSidebar'

type DrawerProps = {
  children: React.ReactNode
}

/**
 * The main Drawer component that wraps around the application content.
 */
export function Drawer({ children }: DrawerProps): React.JSX.Element {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <OldSidebar children={children} />
      {children}
    </div>
  )
}

export const DrawerProvider = ({ children }: DrawerProps) => {
  return (
    <ProjectWindowProvider>
      <Drawer> {children}</Drawer>
    </ProjectWindowProvider>
  )
}
