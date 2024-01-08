// DOCUMENTED
/**
 * A functional component that renders information in a div element.
 * @param {object} control - The control object that contains the information to be displayed.
 * @returns {React.JSX.Element} - The JSX representation of the component.
 */
const InfoControl = ({
  control,
}: {
  control: { data: { info: string } }
}): React.JSX.Element => {
  return (
    <div style={{ whiteSpace: 'pre-line' }}>
      <p>{control.data.info}</p>
    </div>
  )
}

export default InfoControl
