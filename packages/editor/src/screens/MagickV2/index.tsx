
import { GridviewApi, GridviewReact, GridviewReadyEvent, IGridviewPanelProps, Orientation } from "dockview";
import MainPanel from "./panels/mainPanel";
import { useEffect, useState } from "react";
import { useHotkeys } from 'react-hotkeys-hook'
import FileDrawer from "./panels/fileDrawer";

const components = {
  MainPanel,
  default: (props: IGridviewPanelProps<{ title: string }>) => {
    return (
      <div
        style={{
          height: '100%',
          padding: '20px',
          background: 'var(--dv-group-view-background-color)',
        }}
      >
        {JSON.stringify(props.params)}
      </div>
    );
  },
  FileDrawer
};

const loadDefaultLayout = (api: GridviewApi) => {
  api.addPanel({
    id: 'panel_1',
    component: 'default',
    params: {
      title: 'Panel 1',
    },
    maximumHeight: 15,
    minimumHeight: 15,
  });

  api.addPanel({
    id: 'panel_3',
    component: 'FileDrawer',
    params: {
      title: 'Panel 3',
    },
  });

  api.addPanel({
    id: 'panel_5',
    component: 'MainPanel',
    params: {
      title: 'Panel 5',
    },
    position: { referencePanel: 'panel_3', direction: 'right' },
  })
  api.addPanel({
    id: 'panel_6',
    component: 'default',
    params: {
      title: 'Panel 6',
    },
    position: { referencePanel: 'panel_5', direction: 'right' },
  }).api.setSize({
    width: 5
  });

  console.log(api.toJSON())
}

const MagickV2 = () => {

  const onReady = (event: GridviewReadyEvent) => {
    loadDefaultLayout(event.api);
  };

  return (
    <GridviewReact
      components={components}
      onReady={onReady}
      proportionalLayout={false}
      orientation={Orientation.VERTICAL}
      className="dockview-theme-abyss"
    />
  );

  // return (
  //   <MainPanel />
  // );
}

export default MagickV2