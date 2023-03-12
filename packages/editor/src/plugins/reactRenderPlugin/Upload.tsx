import React from 'react'
import axios from 'axios'
import { API_ROOT_URL } from '@magickml/engine'

const fileToDataUri = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = event => {
      resolve(event.target.result)
    }
    reader.readAsDataURL(file)
  })

type UploadState = {
  file: string
  output: string
  dataURI: string
}

type UploadProps = {
  id_image: string
  output: string
}

// todo convert this from class to function.  We should not be uing class components.
export class Upload extends React.Component<UploadProps, UploadState> {
  id_image: string
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      output: props.output,
      dataURI: null,
    }
    this.id_image = props.id_image
    this.handleChange = this.handleChange.bind(this)
  }
  async handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    })
    const file = event.target.files[0]
    fileToDataUri(file).then(dataUri => {
      axios({
        method: 'post',
        url: `${API_ROOT_URL}/upload`,
        data: {
          id: this.id_image,
          uri: dataUri,
        },
      })
    })
  }
  render() {
    return (
      <div style={{ height: '200px' }}>
        <input type="file" onChange={this.handleChange} />
        <img
          src={this.state.file}
          style={{ width: '100%', maxHeight: '100%' }}
        />
      </div>
    )
  }
}
