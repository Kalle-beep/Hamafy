import React from 'react';
const R = require('ramda');

export default class ColorChooser extends React.Component{
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

    _toHex(pixel){
        return R.compose(
            R.reduce((acc, val) => acc + val, '#'),
            R.map(k => this._decToHex(pixel[k]).toUpperCase()),
            R.sortWith([R.descend]),
            R.keys)(pixel);
    }
    _decToHex(d){
        return Number(d).toString(16).padStart(2, '0');
    }
    onChangeColor(event){
        let color = event.target.value;
        let r = parseInt('0x'+color.substr(1,2));
        let g = parseInt('0x'+color.substr(3,2));
        let b = parseInt('0x'+color.substr(5,2));
        let pixel = {r:r,g:g,b:b};
        this.setState({color:pixel});
        this.props.onChange(R.merge(pixel, {a: this.state.alpha, index: this.state.index}));
    }

    onChangeAlpha(event){
        var alpha = event.target.value;
        this.setState({'alpha' : alpha});
    }

    onUpdate(){
        this.props.onChange(R.merge(this.state.color, this.state.alpha));
    }

    render (){
        return (<div style={this.props.style}>
           <input type="color" value={this._toHex(this.state.color)} onChange={this.onChangeColor}/>
            <input type="range" value={this.state.alpha} min="0" max="255" onChange={this.onChangeAlpha}/>
        </div>);
    }
}