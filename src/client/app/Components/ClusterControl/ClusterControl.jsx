import React from 'react';
import ClusterColor from './ClusterColor';

const R = require('ramda');

export default class ClusterControl extends React.Component{

    constructor(props){
        super(props);

        this.onColorChange = this.onColorChange.bind(this);
        this.onSaveImage = this.onSaveImage.bind(this);

        this.userClusters = [];
    }

    componentDidUpdate(){
        this.userClusters = (this.props.clusters||[]).map(c => R.merge(c.centroid,{index: c.index}));
    }

    onColorChange(color){
        this.userClusters = this.userClusters.filter(c => c.index !== color.index);
        this.userClusters.push(color);
    }

    onSaveImage(){
        this.props.onSaveImage(this.userClusters);
    }
    renderClusters(){
        return this.props.clusters.map(cluster => <li key={cluster.index}><ClusterColor color={cluster.centroid} index={cluster.index} onChange={this.onColorChange}/></li>)
    }


    render (){
        if (this.props.clusters && this.props.clusters.length > 0){
            return (
                <div style={{width : '50%'}}>
                    <ul style={{listStyle: "none"}}>{this.renderClusters()}</ul>
                    <button onClick={this.onSaveImage}>Save</button>
                </div>
            );
        } else{
            return (<div></div>);
        }

    }
}