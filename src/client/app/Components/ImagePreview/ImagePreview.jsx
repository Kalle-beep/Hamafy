import React from 'react';

export default class ImagePreview extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.updateCanvas();
    }

    componentDidUpdate(){
        this.updateCanvas();
    }

    updateCanvas(){
        if (this.props.content){
            const canvas = this.refs.canvas;
            const contex = canvas.getContext('2d');
            contex.clearRect(0, 0, canvas.width, canvas.height);
            contex.putImageData(this.props.content, 0, 0);
        }
    }
    render (){
        if (this.props.content) {
            return (
                <div>
                    <canvas ref="canvas" id="previewCanvas" width={this.props.content.width}
                            height={this.props.content.height}/>
                </div>
            );
        } else{
            return (
                <div>

                </div>
            );
        }

    }
}