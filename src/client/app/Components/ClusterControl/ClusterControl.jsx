import React from 'react';
import ClusterColor from './ClusterColor';

export default class ClusterControl extends React.Component{

    constructor(props){
        super(props);

        this.onColorChange = this.onColorChange.bind(this);
    }

    onColorChange(){

    }

    renderClusters(){
        return this.props.clusters.map(cluster => <li key={cluster.index}><ClusterColor color={cluster.centroid} onChange={this.onColorChange}/></li>)
    }

    render (){
        if (this.props.clusters && this.props.clusters.length > 0){
            return (
                <div>
                    <ul>{this.renderClusters()}</ul>
                    <button>Save</button>
                </div>
            );
        } else{
            return (<div></div>);
        }

    }
}