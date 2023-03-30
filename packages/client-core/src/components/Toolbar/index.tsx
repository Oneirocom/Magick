// GENERATED 
/**
 * A React functional component that renders a toolbar with two sections
 *
 * @param {Object} props - The props object
 * @param {Object} props.toolbar - The JSX element to render in the first section
 * @param {Object} props.options - The JSX element to render in the second section
 * 
 * @return {JSX.Element} - A JSX element representing a toolbar with two sections
 */
export const Toolbar: React.FunctionComponent<{toolbar: React.ReactNode, options: React.ReactNode}> = ({ toolbar, options }) => {
  return (
    <div className="th-toolbar">
      <div className="toolbar-section">{toolbar}</div>
      <div className="toolbar-section">{options}</div>
    </div>
  )
} 

// Note: The CSS modules import can be left as-is since it already conforms to the Google code standards.