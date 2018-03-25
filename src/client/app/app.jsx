import React from "react";
import ReactDOM from "react-dom";

import ImageLoader from "./Components/ImageLoader/imageloader";
import ImagePreview from "./Components/ImagePreview/ImagePreview";
import ImageScaler from "./Components/ImageScaler/ImageScaler";
import CentroidControl from "./Components/CentroidControl/CentroidControl";
import ClusterControl from "./Components/ClusterControl/ClusterControl";

import ImageLoadService from "./services/ImageLoader/ImageLoaderService";
import ImageScaleService from "./services/ImageScaler/ImageScaleService";

export default class App extends React.Component{
    constructor(){
        super();
        this.centroids = [];
        this.clusters = [];
        this.imageLoadService = new ImageLoadService();
        this.imageScaleService = new ImageScaleService();

        this.onLoadImage = this.onLoadImage.bind(this);
        this.onScaleImage = this.onScaleImage.bind(this);
        this.state = {};
    }

    onLoadImage(uri){
        this.imageLoadService.loadImage(uri).then(image => {
            this.setState({imageData : image});
            console.log("Image Loaded");
        });
    }

    onScaleImage(width, height){
        if (this.state.imageData){
            this.imageScaleService.scale(this.state.imageData, width, height).then(scaledImage =>{
                this.setState({scaledImage : scaledImage});
            });
        }
    }

    render(){
        return (
            <div>
                <p>Hamafy</p>

                <div>
                    <ImageLoader onLoadImage={this.onLoadImage}></ImageLoader>
                    <ImagePreview content={this.state.scaledImage}></ImagePreview>
                </div>
                <div>
                    <ImageScaler onScaleImage={this.onScaleImage}></ImageScaler>
                    <div>
                        <div>
                            <CentroidControl centroids={this.centroids}/>
                        </div>
                        <div>
                            <ClusterControl clusters={this.clusters}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app"));