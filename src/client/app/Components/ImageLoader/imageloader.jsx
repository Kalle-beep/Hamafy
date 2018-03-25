import React from 'react';

export default class FileLoader extends React.Component{
    constructor(props){
        super(props);
        this.loadImage = this.loadImage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {text : ''};
    }

    loadImage(e){
        this.props.onLoadImage(this.state.text);
    }

    handleChange(e){
        this.setState({text: e.target.value});
    }

    render (){
        const text = this.state.text;
        return (
            <div>
                <input type="text" value={text} onChange={this.handleChange}/>
                <button onClick={this.loadImage}>Load</button>
            </div>
        );
    }
}