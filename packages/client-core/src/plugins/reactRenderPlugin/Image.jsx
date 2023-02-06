/* eslint-disable react/prop-types */
import React from 'react'
export class Image extends React.Component {

  render() {
    const { imgSRC } = this.props
    return (
      <img src={imgSRC}></img>
    )
  }
}
