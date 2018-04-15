import React from 'react';
import ColorChooser from '../ColorControl/ColorChooser';
import './ClusterColor.css';

const R = require('ramda');
/**
 * Class for Control for showing and changing cluster color
 */
export default class ClusterColor extends React.Component{
    /**
     * binding event handlers to object and setting up state form the properties
     * @param props
     */
    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);
        this.color = this.color.bind(this);
        this.state = {
            color : this.props.color,
            userColor : this.props.color
        }
    }

    /**
     * event handler for propagating change cluster color event forward
     * @param color - rgba value with index in the cluster array.
     */
    onChange(color){
        this.props.onChange(color);
    }

    /**
     * converts color to rgba form for css style
     * @returns {string}
     */
    color(){
        return 'rgba('+this.state.color.r+','+this.state.color.g+','+this.state.color.b+','+this.state.color.a+')'
    }
    render(){
        return (<div>
            <div className="colorChooser" style={{backgroundColor: this.color(), width: '5%'}}></div><ColorChooser style={{display : 'inline-block', width: '80%'}}color={R.merge(this.state.userColor, {index: this.props.index})} onChange={this.onChange}/>
        </div>);
    }
}