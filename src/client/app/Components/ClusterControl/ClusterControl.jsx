import React from 'react';
import ClusterColor from './ClusterColor';

const R = require('ramda');

/**
 * Class for controlling cluster colors
 */
export default class ClusterControl extends React.Component{

    constructor(props){
        super(props);

        this.onColorChange = this.onColorChange.bind(this);
        this.onSaveImage = this.onSaveImage.bind(this);

        this.userClusters = [];
    }

    /**
     * After the change of state, change is incorporated to user clusters
     */
    componentDidUpdate(){
        this.userClusters = (this.props.clusters||[]).map(c => R.merge(c.centroid,{index: c.index}));
    }

    /**
     * event handler for changing the color of the cluster in user clusters
     * @param color
     */
    onColorChange(color){
        this.userClusters = this.userClusters.filter(c => c.index !== color.index);
        this.userClusters.push(color);
    }

    /**
     * event handler for propagating save image event to app to render image with custom user defined colors.
     */
    onSaveImage(){
        this.props.onSaveImage(this.userClusters);
    }

    /**
     * renders clusterclor controls.
     * @returns {*}
     */
    renderClusters(){
        return this.props.clusters.map(cluster => <li key={cluster.index}><ClusterColor color={cluster.centroid} index={cluster.index} onChange={this.onColorChange}/></li>)
    }

    /**
     * renders the cluster if those exists otherwise just empty div
     * @returns {*}
     */
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