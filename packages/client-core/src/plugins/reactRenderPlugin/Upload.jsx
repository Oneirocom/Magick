import React from "react"
import axios from 'axios';
import { VITE_APP_API_URL } from "../../../../engine/src";

const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result)
    };
    reader.readAsDataURL(file);
    })

export class Upload extends React.Component {
    constructor(props){
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
            let file = event.target.files[0]
            fileToDataUri(file)
            .then(dataUri => {
                axios({
                    method: 'post',
                    url: `${VITE_APP_API_URL}/DiscordPlugin`,
                    data: {
                      id: this.id_image,
                      uri: dataUri
                    }
                  });
            })
            
            }
    render() {
        return (
            <div style={{height: "200px"}}>
                <input type="file" onChange={this.handleChange}/>
                <img src={this.state.file} style={{width:'100%', maxHeight:'100%'}} />
            </div>
            );
    }
}
