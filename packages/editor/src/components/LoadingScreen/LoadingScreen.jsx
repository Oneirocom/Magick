import ankh from './ankh.gif'

const LoadingScreen = () => (
  <div
    style={{
      height: '100%',
      width: '100%',
      backgroundColor: 'var(--dark-3)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      <img
        style={{
          height: 'var(--7)',
          width: 'var(--7)',
          display: 'inline-block',
        }}
        src={ankh}
        alt={'loading'}
      />
      <p>Please wait...</p>
    </div>
  </div>
)

export default LoadingScreen
