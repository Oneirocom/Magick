'use client'

import AutorenewIcon from '@mui/icons-material/Autorenew'
import { RootState, selectTabNodesLength } from 'client/state'
import { useSelector } from 'react-redux'
import { cx } from 'class-variance-authority'
import { cn } from '@magickml/client-ui'

const VerticalDivider = () => (
  <div className="inline-block h-[250px] min-h-[1em] w-0.5 self-stretch bg-[var(--background-color)] opacity-100 dark:opacity-50"></div>
)

export const StatusBar = () => {
  const { currentTab } = useSelector((state: RootState) => state.tabLayout)
  const nodesLength = useSelector(
    selectTabNodesLength(currentTab?.id as string)
  )
  const { syncing, connected } = useSelector(
    (state: RootState) => state.statusBar
  )
  const { currentAgentId } = useSelector(
    (state: RootState) => state.globalConfig
  )

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
      <p className="truncate">Total nodes: {nodesLength}</p>
      <VerticalDivider />
      <p className="truncate">Current agent: {currentAgentId}</p>
      <VerticalDivider />
      <p className="truncate">
        Current spell id: {currentTab?.params.spellId as string}
      </p>
      <VerticalDivider />
    </div>
  )
}
