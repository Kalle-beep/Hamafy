import React from 'react';
import ColorChooser from '../ColorControl/ColorChooser';
var R = require('ramda');

export default class CentroidControl extends React.Component{

    constructor(props){
        super(props);
        this.onClusterify = this.onClusterify.bind(this);
        this.onChangeColor = this.onChangeColor.bind(this);
        this.centroids = this.props.centroids;
    }

    onClusterify(){
        this.props.onClusterify();
    }


    onChangeColor(pixel){
        this.props.onChangeColor(pixel);
    }

    renderCentroids(){
        return this.centroids.map(centroid => <li key={centroid.index}><ColorChooser color={centroid} onChange={this.onChangeColor}/></li>);
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

    render (){
        return (
            <div>
                <ul>{this.renderCentroids()}</ul>
                <button onClick={this.onClusterify}>Clusterify</button>
            </div>
        );
    }
}