import React from 'react';
import ColorChooser from '../ColorControl/ColorChooser';

/**
 * Class for selecting starting point for making clusters image colors.
 */
export default class CentroidControl extends React.Component{

    /**
     * Constructor set control properties to control and binds event handlers to object.
     * @param props
     */
    constructor(props){
        super(props);
        this.onClusterify = this.onClusterify.bind(this);
        this.onChangeColor = this.onChangeColor.bind(this);
        this.centroids = this.props.centroids;
    }

    /**
     * Event handler which propagates clusterification event to app component.
     */
    onClusterify(){
        this.props.onClusterify();
    }

    /**
     * Event handler which propagates clusterification event to app component.
     */
    onChangeColor(pixel){
        this.props.onChangeColor(pixel);
    }

    /**
     * Renders centroids to controls
     * @returns {*} -- centorids as controls
     */
    renderCentroids(){
        return this.centroids.map(centroid => <li key={centroid.index}><ColorChooser color={centroid} onChange={this.onChangeColor}/></li>);
    }

    render (){
        return (
            <div style={{width: '50%'}}>
                <ul style={{listStyle: "none"}}>{this.renderCentroids()}</ul>
                <button onClick={this.onClusterify}>Clusterify</button>
            </div>
        );
    }
}