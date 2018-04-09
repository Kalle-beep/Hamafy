import React from 'react';
import ColorChooser from '../ColorControl/ColorChooser';
import './ClusterColor.css';

export default class ClusterColor extends React.Component{
    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);
        this.color = this.color.bind(this);
        this.state = {
            color : this.props.color,
            userColor : this.props.color
        }
    }

    onChange(color){
        this.props.onChange(color);
    }
    color(){
        return 'rgba('+this.state.color.r+','+this.state.color.g+','+this.state.color.b+','+this.state.color.a+')'
    }
    render(){
        return (<div>
            <div className="colorChooser" style={{backgroundColor: this.color()}}></div><ColorChooser style={{display : 'inline-block', width: '70%'}}color={this.state.userColor} onChange={this.onChange}/>
        </div>);
    }
}