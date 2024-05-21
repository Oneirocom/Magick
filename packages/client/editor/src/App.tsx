'use client'
/**
 * A functional component that renders the 'Routes' component.
 */
import React from 'react'

import MagickV2 from './screens'
// import { FrigadeAnnouncement } from '@frigade/react'

function App(): React.JSX.Element {
  return (
    <>
      {/* TODO: Uncoment after we add frigade provdier to approuter */}
      {/* <FrigadeAnnouncement
        flowId="flow_8ZIGBYvK0fP6r4Fa"
        modalPosition="center"
      /> */}
      <MagickV2 />
    </>
  )
}

export default App
