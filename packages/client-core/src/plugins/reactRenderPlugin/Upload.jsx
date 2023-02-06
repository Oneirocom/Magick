import React from "react"
export class Upload extends React.Component {
    constructor(props){
            super(props)
            this.state = {
                file: null,
                output: props.output
            }
            this.handleChange = this.handleChange.bind(this)
        }
        handleChange(event) {
            this.setState({
                file: URL.createObjectURL(event.target.files[0]),
            })}
    render() {
        return (
            <div style={{height: "200px"}}>
                <input type="file" onChange={this.handleChange}/>
                <img src={this.state.file} style={{width:'100%', maxHeight:'100%'}} />
            </div>
            );
    }
}
