// GENERATED 
/**
 * Represents a form to add a new socket element.
 *
 * @param {Object} props - The props object.
 * @param {string} props.value - The value of the input element.
 * @param {function} props.onChange - The function called whenever the input element changes.
 * @param {function} props.onAdd - The function called whenever the form is submitted.
 * @returns {JSX.Element} A JSX form element.
 */
const AddNewSocket = (props) => {
  const { value, onChange, onAdd } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value) {
      return;
    }
    onAdd(event);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        placeholder="Name your socket..."
        onChange={onChange}
      />
      <button type="submit">Add</button>
    </form>
  );
};

/**
 * Represents a single socket element.
 * 
 * @param {Object} props - The props object.
 * @param {string} props.name - The name of the socket element.
 * @param {function} props.delete - The function called when the delete button is clicked.
 * @param {string} props.type - The type of the socket element.
 * @returns {JSX.Element} A JSX element rendering a single socket.
 */
const SingleElement = (props) => {
  const { name, delete: deleteSocket, type } = props;

  const handleDeleteSocket = () => {
    deleteSocket(name);
  };

  return (
    <div>
      <div>{name}</div>
      <div>{type}</div>
      <button onClick={handleDeleteSocket}>Delete</button>
    </div>
  );
};

/**
 * A generator for socket elements.
 *
 * @param {Object} props - The props object.
 * @param {function} props.updateData - The function to update the data.
 * @param {Object} props.control - An object which contains control parameters.
 * @param {Array} props.initialValue - Array of initial socket elements.
 * @returns {JSX.Element} A JSX element rendering the socket generator.
 */
const SocketGenerator = ({ updateData, control, initialValue }) => {
  const [sockets, setSockets] = useState(initialValue);

  useEffect(() => {
    if (!initialValue) {
      return;
    }
    const newSockets = initialValue.filter((socket) =>
      data.ignored.every((ignored) => ignored.name !== socket.name)
    );
    setSockets(newSockets);
  }, [initialValue, data.ignored]);

  const update = (updatedSockets) => {
    updateData({ [control.dataKey]: updatedSockets });
  };

  const handleDeleteSocket = (name) => {
    const newSockets = sockets.filter((socket) => socket.name !== name);
    setSockets(newSockets);
    update(newSockets);
  };

  const handleAddSocket = (newValue) => {
    const newSocket = {
      name: newValue,
      taskType: control.data.taskType,
      socketKey: newValue,
      connectionType: control.data.connectionType,
      socketType: control.data.socketType,
    };
    const newSockets = [newSocket, ...sockets];

    setSockets(newSockets);
    update(newSockets);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <AddNewSocket
        value={''}
        onChange={() => setSockets}
        onAdd={handleAddSocket}
      />
      {sockets.map((socket, index) => (
        <SingleElement
          key={index}
          name={socket.name}
          delete={handleDeleteSocket}
          type={socket.socketType}
        />
      ))}
    </div>
  );
};

export default SocketGenerator;