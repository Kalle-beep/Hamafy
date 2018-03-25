import React from 'react';

export default class ImageScaler extends React.Component{
    constructor(props){
        super(props);
        this.scaleImage = this.scaleImage.bind(this);
        this.onChangeX = this.onChangeX.bind(this);
        this.onChangeY = this.onChangeY.bind(this);
    }

    scaleImage(){
        this.props.onScaleImage(this.state.x, this.state.y);
    }

    onChangeX(e){
        this.setState({x: e.target.value});
    }

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