import { createContext, useContext } from "react"

type DocviewContext = {}

// Creating the context
const Context = createContext<DocviewContext>(undefined!)

// Helper hook to use Layout context
export const useLayout = () => useContext(Context)

export const DockviewProvider = ({ children }) => {
  return <div>
    {children}
  </div>
}