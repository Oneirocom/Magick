// DOCUMENTED
/**
 * A dropdown component that can be customized with a title and options.
 * @param {object} props - The props object contains a title string and an array of options.
 * @param {string} props.title - The title of the dropdown.
 * @param {string[]} props.data - The options to be displayed in the dropdown.
 */
export default function CustomDropdown(props: {
  title: string
  data: string[]
}): React.ReactElement {
  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        background: '#f0f0f0',
        height: '100vh',
      }}
    >
      <div style={{ width: '10.5em', margin: '0 auto' }}>
        <div
          style={{
            marginBottom: '0.8em',
            padding: '0.4em 2em 0.4em 1em',
            boxShadow: '0 2px 3px rgba(0, 0, 0, 0.15)',
            fontWeight: 500,
            fontSize: '1.3rem',
            color: '#3faffa',
            background: '#ffffff',
          }}
        >
          {props.title}
        </div>
        <div>
          <ul
            style={{
              padding: 0,
              margin: 0,
              paddingLeft: '1em',
              background: '#ffffff',
              border: '2px solid #e5e5e5',
              boxSizing: 'border-box',
              color: '#3faffa',
              fontSize: '1.3rem',
              fontWeight: 500,
            }}
          >
            {props.data.map((option, index) => (
              <li
                key={index}
                style={{ listStyle: 'none', marginBottom: '0.8em' }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/*
  We disable @typescript-eslint/no-unused-vars because `props` is actually used in this Component
*/
