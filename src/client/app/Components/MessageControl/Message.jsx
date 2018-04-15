import React from 'react';

export default class MessageContainer extends React.Component{
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(){
        this.props.onOk();
    }

    render(){
        if (this.props.message)
            return (<div>
                <p>{this.props.message}</p><button onClick={this.onClick}>Ok</button>
            </div>)
        else
            return (<div></div>)
    }
}