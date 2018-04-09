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
            let data = this.props.content.toImageData();
            const canvas = this.refs.canvas;
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle ="rgba(255, 255, 255, 255)";
            context.beginPath();
            context.fillRect(0, 0, data.width, data.height);
            context.fill();
            context.globalCompositeOperation = 'source-over';
            context.putImageData(this.props.content.toImageData(), 0, 0);
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