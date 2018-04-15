import React from 'react';

/**
 * Component for reading scaled image size values from user
 */
export default class ImageScaler extends React.Component{
    /**
     * binds event handlers and sets properties to an object.
     * @param props
     */
    constructor(props){
        super(props);
        this.scaleImage = this.scaleImage.bind(this);
        this.onChangeX = this.onChangeX.bind(this);
        this.onChangeY = this.onChangeY.bind(this);
    }

    /**
     * event handler to relay scaled image size values to app
     */
    scaleImage(){
        this.props.onScaleImage(this.state.x, this.state.y);
    }

    /**
     * event handler to set value written in width box to state
     * @param e
     */
    onChangeX(e){
        this.setState({x: e.target.value});
    }

    /**
     * event handler to set value written in height box to state
     * @param e
     */
    onChangeY(e){
        this.setState({y: e.target.value});
    }

    render (){
        return (
            <div>
                <input type="text" onChange={this.onChangeX}/>
                <input type="text" onChange={this.onChangeY}/>
                <button onClick={this.scaleImage}>Scale</button>
            </div>
        );
    }
}