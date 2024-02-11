import { usePubSub } from '@magickml/providers'
import { Button } from '@magickml/client-ui'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { RootState } from 'client/state'
import { enqueueSnackbar } from 'notistack'
import { useSelector } from 'react-redux'

const VerticalDivider = () => (
  <div className="inline-block h-[250px] min-h-[1em] w-0.5 self-stretch bg-[var(--background-color)] opacity-100 dark:opacity-50"></div>
)

export const StatusBar = () => {
  const { publish, events } = usePubSub()
  const { currentTab } = useSelector((state: RootState) => state.tabLayout)
  const { syncing, connected } = useSelector(
    (state: RootState) => state.statusBar
  )
  const { currentAgentId } = useSelector(
    (state: RootState) => state.globalConfig
  )

  const onKill = () => {
    publish(events.SEND_COMMAND, {
      command: 'agent:spellbook:killSpells',
    })

    publish(events.RESET_NODE_STATE)

    enqueueSnackbar('All spells stopped.  Send an event to start them again.', {
      variant: 'success',
    })
  }

  const onRefresh = () => {
    publish(events.SEND_COMMAND, {
      command: 'agent:spellbook:refreshSpells',
    })

    publish(events.RESET_NODE_STATE)

    enqueueSnackbar('All spells refreshed.', {
      variant: 'success',
    })
  }

  return (
    <div
      style={{
        height: '100%',
        padding: '0px 10px',
        background: 'var(--foreground-color)',
        borderTop: '1px solid var(--deep-background-color)',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <span style={{ color: connected ? 'green' : 'red', fontSize: 22 }}>
        ●
      </span>
      <p style={{ marginRight: 20 }}>{connected ? 'Online' : 'Offline'}</p>
      <VerticalDivider />
      <p>Syncing: </p>
      <AutorenewIcon
        sx={{
          marginRight: '20px',
          animation: syncing ? 'spin 2s linear infinite' : 'none',
          '@keyframes spin': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(230deg)',
            },
          },
        }}
      />
      <VerticalDivider />
      <p>Current Tab: {currentTab?.title}</p>
      <VerticalDivider />
      <p>Current agent: {currentAgentId}</p>
      <VerticalDivider />
      <p>Current spell id: {currentTab?.params.spellId as string}</p>
      <VerticalDivider />

      <div className="flex flex-grow justify-end">
        <Button className="h-7 mr-4" variant="secondary" onClick={onRefresh}>
          Reset
        </Button>
        <Button className="h-7" variant="destructive" onClick={onKill}>
          Kill
        </Button>
      </div>
    </div>
  )
}
