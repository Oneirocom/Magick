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

export const defaultLayoutConfig: PanelConfig[] = [
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
      // Ensure tab, spellId, spellName are defined or passed appropriately
      tab: 'YourTab',
      spellId: 'YourSpellId',
      spellName: 'YourSpellName',
    },
  },
  {
    id: 'Properties',
    component: 'Properties',
    tabComponent: 'permanentTab',
    params: {
      title: 'Properties',
      tab: 'YourTab',
      spellId: 'YourSpellId',
      spellName: 'YourSpellName',
    },
    position: { referencePanel: 'Graph', direction: 'left' },
    constraints: {
      minimumWidth: 270,
    },
  },
  {
    id: 'Variables',
    component: 'Variables',
    params: {
      title: 'Variables',
      tab: 'YourTab',
      spellId: 'YourSpellId',
      spellName: 'YourSpellName',
    },
    position: { referencePanel: 'Properties', direction: 'below' },
    constraints: {
      minimumWidth: 270,
    },
  },
  {
    id: 'Test',
    component: 'Test',
    params: {
      title: 'Test',
      tab: 'YourTab',
      spellId: 'YourSpellId',
      spellName: 'YourSpellName',
    },
    position: { referencePanel: 'Graph', direction: 'right' },
  },
  {
    id: 'Text Editor',
    component: 'TextEditor',
    params: {
      title: 'Text Editor',
      tab: 'YourTab',
      spellId: 'YourSpellId',
      spellName: 'YourSpellName',
    },
    position: { referencePanel: 'Test', direction: 'below' },
  },
]

export const applyLayoutConfig = api => {
  defaultLayoutConfig.forEach(config => {
    const panel = api.addPanel({
      id: config.id,
      component: config.component,
      params: config.params,
      position: config.position,
      tabComponent: config.tabComponent,
    })

    if (config.groupModifications) {
      if (config.groupModifications.locked) {
        panel.group.locked = true
      }
      if (config.groupModifications.headerHidden) {
        panel.group.header.hidden = true
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

export const applyConstraintsFromConfig = ({ api }) => {
  api.panels.forEach(panel => {
    defaultLayoutConfig.map(config => {
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
