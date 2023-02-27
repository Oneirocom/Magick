/* eslint-disable react/prop-types */
import React from 'react'

type Props = {
  imgSRC: string
}
export class Image extends React.Component<Props> {
  render() {
    const { imgSRC } = this.props
    return <img src={imgSRC}></img>
  }
}
