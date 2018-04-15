import React from 'react';

/**
 * Class for a control which is used to propagate imageloading event for some uri
 */
export default class FileLoader extends React.Component{
    constructor(props){
        super(props);
        this.loadImage = this.loadImage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {text : ''};
    }

    /**
     * event handler to propagate event forward to app
     * @param e
     */
    loadImage(e){
        this.props.onLoadImage(this.state.text);
    }

    /**
     * when text is wrtten to input state of the control is changed.
     * @param e
     */
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