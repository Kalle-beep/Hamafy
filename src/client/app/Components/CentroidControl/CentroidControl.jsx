import React from 'react';

export default class CentroidControl extends React.Component{

    constructor(props){
        super(props);
        this.centroids = this.props.centroids.map(centroid => <li><input type="color" value={centroid.color}/>{centroid.color}</li>)
    }
    render (){
        return (
            <div>
                <ul>{this.centroids}</ul>
                <button>Clusterify</button>
            </div>
        );
    }
}