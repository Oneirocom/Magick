/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react'
import whyDidYouRender from '@welldone-software/why-did-you-render'

if (import.meta.env.NODE_ENV === 'development') {
  console.log('running WDYR!')
  whyDidYouRender(React, {
    trackAllPureComponents: false,
  })
}
