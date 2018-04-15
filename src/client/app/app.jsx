import React from "react";
import ReactDOM from "react-dom";

import ImageLoader from "./Components/ImageLoader/imageloader";
import ImagePreview from "./Components/ImagePreview/ImagePreview";
import ImageScaler from "./Components/ImageScaler/ImageScaler";
import CentroidControl from "./Components/CentroidControl/CentroidControl";
import ClusterControl from "./Components/ClusterControl/ClusterControl";
import MessageControl from './Components/MessageControl/Message';

import ImageLoadService from "./services/ImageLoader/ImageLoaderService";
import ImageScaleService from "./services/ImageScaler/ImageScaleService";
import ClusterifyService from "./services/ClusterifyService/ClusterifyService";
import PaletteService from "./services/PaletteService/PaletteService"
import ImageModelFactory from "./services/ImageModelFactory/ImageModelFactory"

const R = require('ramda');

export default class App extends React.Component{
    constructor(){
        super();
        this.centroids = [];
        this.clusters = [];

        this.imageLoadService = new ImageLoadService();
        this.imageScaleService = new ImageScaleService(new ImageModelFactory());
        this.clusterService = new ClusterifyService();
        this.paletteService = new PaletteService();

        this.onLoadImage = this.onLoadImage.bind(this);
        this.onScaleImage = this.onScaleImage.bind(this);
        this.onClusterify = this.onClusterify.bind(this);
        this.onPaletteChange = this.onPaletteChange.bind(this);
        this.onSaveImage = this.onSaveImage.bind(this);
        this.onMessageOk = this.onMessageOk.bind(this);

        this.state = { palette : this.paletteService.defaultPalette()};


    }

    componentDidMount(){
        this.setState({'palette' : this.paletteService.defaultPalette()});
    }

    onLoadImage(uri){
        this.imageLoadService.loadImage(uri).then(image => {
            this.setState({imageData : image, message: "Image loaded"});

        });
    }

    onScaleImage(width, height){
        if (this.state.imageData){
            this.imageScaleService.scale(this.state.imageData, width, height).then(scaledImage =>{
                this.setState({
                    scaledImage : scaledImage,
                    clusters : null,
                    test : null,
                    message: "Image Scaled"
                });
            });
        }
    }

    onClusterify(){
        if (this.state.scaledImage && this.state.palette){
            this.clusterService.k_nearest_neighbours(this.state.scaledImage.toPixels(), this.state.palette).then(clusters => {
                let image = this.state.scaledImage.simplifyPalette(clusters);
                this.setState({test: image});
                this.setState({
                    clusters : clusters,
                    message: "Image clusterified"});
            });
        }
    }

    onPaletteChange(paletteColor){
        let palette = this.state.palette;
        palette[paletteColor.index] = paletteColor;
        this.setState({palette : palette});
    }

    onSaveImage(userClusters){

        let userClusterMap = R.compose(
                                        R.map(c => R.dissoc('index', c)),
                                        R.sortBy(R.prop('index')),
                                        R.uniqBy(R.prop('index'))
                                      )(userClusters);

        let clusters = R.map(c => R.merge(c, {centroid : userClusterMap[c.index]||c.centroid}), this.state.clusters);

        let image = this.state.scaledImage.simplifyPalette(clusters);
        this.setState({test: image});
    }

    onMessageOk(){
        this.setState({message: null});
    }

    render(){
        return (
            <div>
                <p>Hamafy</p>
                <div style={{display : 'inline-flex', flexDirection :'row', width : '100%'}}>
                    <div style={{width:'30%'}}>
                        <ImageLoader onLoadImage={this.onLoadImage}></ImageLoader>
                        <ImageScaler onScaleImage={this.onScaleImage}></ImageScaler>
                        <ImagePreview content={this.state.scaledImage}></ImagePreview>
                        <ImagePreview content={this.state.test}></ImagePreview>
                    </div>
                    <div style={{display: 'inline-flex', flexDirection : 'row', width: '70%'}}>
                        <CentroidControl centroids={this.state.palette} onClusterify={this.onClusterify} onChangeColor={this.onPaletteChange}/>
                        <ClusterControl clusters={this.state.clusters} onSaveImage={this.onSaveImage}/>
                    </div>
                </div>
                <MessageControl message={this.state.message} onOk={this.onMessageOk}/>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app"));