import AutorenewIcon from '@mui/icons-material/Autorenew';
import { RootState } from "client/state"
import { useSelector } from "react-redux"

export const StatusBar = () => {
  const { currentTab } = useSelector((state: RootState) => state.tabLayout)
  const { syncing, connected } = useSelector((state: RootState) => state.statusBar)

  return (
    <div
      style={{
        height: '100%',
        padding: '0px 10px',
        background: 'var(--dv-group-view-background-color)',
        borderTop: '1px solid var(--deep-background-color)',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <span style={{ color: connected ? 'green' : 'red', marginRight: 20, fontSize: 22 }}>●</span>
      <p>Syncing: </p>
      <AutorenewIcon
        sx={{
          marginRight: "20px",
          animation: syncing ? "spin 2s linear infinite" : "none",
          "@keyframes spin": {
            "0%": {
              transform: "rotate(0deg)",
            },
            "100%": {
              transform: "rotate(230deg)",
            },
          },
        }}
      />
      <p>
        Current Tab: {currentTab?.title}
      </p>
    </div>
  )
}