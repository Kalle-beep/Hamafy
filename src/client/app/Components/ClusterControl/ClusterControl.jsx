import React from 'react';

export default class ClusterControl extends React.Component{

    constructor(props){
        super(props);
        this.clusters = this.props.clusters.map(cluster => <li><input type="color" value={cluster.color}/><input type="color" value={cluster.color}/>{centroid.color}</li>)
    }
    render (){
        if (this.clusters.length > 0){
            return (
                <div>
                    <ul>{this.clusters}</ul>
                    <button>Save</button>
                </div>
            );
        } else{
            return (<div></div>);
        }

    }
}