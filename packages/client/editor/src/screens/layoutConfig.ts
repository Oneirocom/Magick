import { DockviewApi } from 'dockview'

type PanelPosition = {
  referencePanel: string
  direction: 'above' | 'below' | 'left' | 'right'
}

type PanelConstraints = {
  minimumWidth?: number
  maximumWidth?: number
  minimumHeight?: number
  maximumHeight?: number
}

type PanelSize = {
  width?: number
  height?: number
}

type GroupModifications = {
  locked?: boolean
  headerHidden?: boolean
}

interface PanelConfig {
  id: string
  component: string
  params: {
    title: string
    tab?: string // Assuming 'tab', 'spellId', and 'spellName' might not be present in all configs
    spellId?: string
    spellName?: string
  }
  tabComponent?: string
  position?: PanelPosition
  constraints?: PanelConstraints
  size?: PanelSize
  groupModifications?: GroupModifications
  priority?: 'LayoutPriority.High' | 'LayoutPriority.Low' // Adjust based on actual priority options
  snap?: boolean
}

// Function to generate dynamic layout configuration
export const generateLayoutConfig = (
  tab: string,
  spellId: string,
  spellName: string
): PanelConfig[] => [
  {
    id: 'panel_1',
    component: 'default',
    params: {
      title: 'Panel 1',
    },
    groupModifications: {
      locked: true,
      headerHidden: true,
    },
  },
  {
    id: 'Graph',
    component: 'Graph',
    params: {
      title: 'Graph',
      tab,
      spellId,
      spellName,
    },
  },
  {
    id: 'Properties',
    component: 'Properties',
    tabComponent: 'permanentTab',
    params: {
      title: 'Properties',
      tab,
      spellId,
      spellName,
    },
    position: { referencePanel: 'Graph', direction: 'left' },
    constraints: {
      // minimumWidth: 270,
    },
  },
  {
    id: 'Variables',
    component: 'Variables',
    params: {
      title: 'Variables',
      tab,
      spellId,
      spellName,
    },
    position: { referencePanel: 'Properties', direction: 'below' },
  },
  {
    id: 'Test',
    component: 'Test',
    params: {
      title: 'Test',
      tab,
      spellId,
      spellName,
    },
    position: { referencePanel: 'Graph', direction: 'right' },
  },
  {
    id: 'Text Editor',
    component: 'TextEditor',
    params: {
      title: 'Text Editor',
      tab,
      spellId,
      spellName,
    },
    position: { referencePanel: 'Test', direction: 'below' },
  },
]

// Function to apply dynamic layout configuration
export const applyDynamicLayoutConfig = ({
  api,
  tab,
  spellId,
  spellName,
}: {
  api: DockviewApi
  tab: string
  spellId: string
  spellName: string
}) => {
  const layoutConfig = generateLayoutConfig(tab, spellId, spellName)
  layoutConfig.forEach(config => {
    const panel = api.addPanel({
      id: config.id,
      component: config.component,
      params: config.params,
      position: config.position,
      tabComponent: config.tabComponent,
    })

    if (config.groupModifications) {
      if (config.groupModifications.locked !== undefined) {
        panel.group.locked = config.groupModifications.locked
      }
      if (config.groupModifications.headerHidden !== undefined) {
        panel.group.header.hidden = config.groupModifications.headerHidden
      }
    }

    if (config.constraints) {
      panel.group.api.setConstraints(config.constraints)
    }

    if (config.size) {
      panel.api.setSize(config.size)
    }
  })
}

export const applyConstraintsFromConfig = ({
  api,
  tab,
  spellId,
  spellName,
}: {
  api: DockviewApi
  tab: string
  spellId: string
  spellName: string
}) => {
  api.panels.forEach(panel => {
    const layoutConfig = generateLayoutConfig(tab, spellId, spellName)
    layoutConfig.map(config => {
      if (config.constraints) {
        const { minimumWidth, maximumWidth, minimumHeight, maximumHeight } =
          config.constraints
        if (minimumWidth) panel.group.api.setConstraints({ minimumWidth })
        if (maximumWidth) panel.group.api.setConstraints({ maximumWidth })
        if (minimumHeight) panel.group.api.setConstraints({ minimumHeight })
        if (maximumHeight) panel.group.api.setConstraints({ maximumHeight })
      }
    })
  })
}
