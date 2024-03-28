import { usePubSub } from '@magickml/providers'
import { Button } from '@magickml/client-ui'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import { RootState } from 'client/state'
import { enqueueSnackbar } from 'notistack'
import { useSelector } from 'react-redux'
import { cx } from 'class-variance-authority'
import { cn } from '@magickml/client-ui'
import posthog from 'posthog-js'

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

    posthog.capture('kill_all_spells', {
      agentId: currentAgentId,
    })

    enqueueSnackbar('All spells stopped.  Send an event to start them again.', {
      variant: 'success',
    })
  }

  const onRefresh = () => {
    publish(events.SEND_COMMAND, {
      command: 'agent:spellbook:refreshSpells',
    })

    publish(events.RESET_NODE_STATE)

    posthog.capture('refresh_all_spells', {
      agentId: currentAgentId,
    })

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
      <div className="flex items-center gap-2">
        <p className={cn('truncate', syncing ? 'text-blue-500' : '')}>
          {syncing ? 'Syncing' : 'Synced'}
        </p>
        <AutorenewIcon
          className={cx('h-4 w-4', syncing ? 'animate-spin' : '')}
        />
      </div>
      <VerticalDivider />
      <p className="truncate">Current Tab: {currentTab?.title}</p>
      <VerticalDivider />
      <p className="truncate">Current agent: {currentAgentId}</p>
      <VerticalDivider />
      <p className="truncate">
        Current spell id: {currentTab?.params.spellId as string}
      </p>
      <VerticalDivider />

      <div className="flex flex-grow justify-end">
        <Button
          className="h-6 mr-4"
          variant="secondary"
          size="sm"
          onClick={onRefresh}
        >
          Reset
        </Button>
        <Button
          className="h-6"
          variant="destructive"
          size="sm"
          onClick={onKill}
        >
          Kill
        </Button>
      </div>
    </div>
  )
}
