import React from 'react';

/**
 * Control for showing messages form application to user to tell about state of the operations.
 */
export default class MessageContainer extends React.Component{
    /**
     * binds event handlers and sets properties to an object.
     * @param props
     */
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * propagates button click which removes to message to app.
     */
    onClick(){
        this.props.onOk();
    }

    render(){
        if (this.props.message)
            return (<div>
                <p>{this.props.message}</p><button onClick={this.onClick}>Ok</button>
            </div>);
        else
            return (<div/>);
    }
}