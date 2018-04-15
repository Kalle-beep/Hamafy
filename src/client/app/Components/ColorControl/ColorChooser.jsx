import React from 'react';
const R = require('ramda');

/**
 * Class for choosing a color
 */
export default class ColorChooser extends React.Component{
    /**
     * binding event handlers to object and setting up state form the properties
     * picks only r, g and b component for color input control because it doesn't support alpha.
     * Alpha value is defined with a slider.
     * @param props
     */
    constructor(props){
        super(props);
        this.state = {
                        color : R.pick(['r','g','b'], props.color),
                        alpha : props.color.a,
                        index : props.color.index
                     };

        this.onChangeColor = this.onChangeColor.bind(this);
        this.onChangeAlpha = this.onChangeAlpha.bind(this);
    }
    /**
     * Converts a pixel to a hexadecimal form for input control.
     * gets keys of the object, orders those in descending alphabetical order r, g, b
     * converts value of each key to tow digit 0 padded hexadecimal form
     * concatenates strings to gether with # -prefix
     * @param pixel - { r, g, b}
     * @returns {*} -pixel as string with prefix containing two digit hexadecimal forms of pixel colors.
     * @private
     */
    _toHex(pixel){
        return R.compose(
            R.reduce((acc, val) => acc + val, '#'),
            R.map(k => this._decToHex(pixel[k]).toUpperCase()),
            R.sortWith([R.descend]),
            R.keys)(pixel);
    }

    /**
     * Converts a number to two digit 0 padded hexadecimal
     * @param d - number
     * @returns {string} - number as two digit hexadecimal as a string
     * @private
     */
    _decToHex(d){
        return Number(d).toString(16).padStart(2, '0');
    }

    /**
     * event handler for changing the color.
     * color value is parsed from inputs hexadecimal form to decimal form. State is changed and color is merged with
     * alpha and index value and propagated forward.
     * @param event
     */
    onChangeColor(event){
        let color = event.target.value;
        let r = parseInt('0x'+color.substr(1,2));
        let g = parseInt('0x'+color.substr(3,2));
        let b = parseInt('0x'+color.substr(5,2));
        let pixel = {r:r,g:g,b:b};
        this.setState({color:pixel});
        this.props.onChange(R.merge(pixel, {a: this.state.alpha, index: this.state.index}));
    }

    /**
     * Event handler for propagating alpha change forward, alpha value is read from range input.
     * @param event
     */
    onChangeAlpha(event){
        let alpha = parseInt(event.target.value);
        this.setState({'alpha' : alpha});
        this.props.onChange(R.merge(this.state.color, {a: this.state.alpha, index: this.state.index}));
    }

    /**
     * When state of the control is changed change event is propagated forward.
     */
    onUpdate(){
        this.props.onChange(R.merge(this.state.color, this.state.alpha));
    }

    render (){
        return (<div style={this.props.style}>
            <input type="color" value={this._toHex(this.state.color)} onChange={this.onChangeColor}/>
            <input type="range" value={this.state.alpha} min="0" max="255" onChange={this.onChangeAlpha} />
        </div>);
    }
}