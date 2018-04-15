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

/*
    Main class for application takes of the application state and relays component generated events to services.
 */
export default class App extends React.Component{
    constructor(){
        super();

        this.imageLoadService = new ImageLoadService();
        this.imageScaleService = new ImageScaleService(new ImageModelFactory());
        this.clusterService = new ClusterifyService();
        this.paletteService = new PaletteService();

        // binds event handler to this object, otherwise this would be the caller in event handler.
        this.onLoadImage = this.onLoadImage.bind(this);
        this.onScaleImage = this.onScaleImage.bind(this);
        this.onClusterify = this.onClusterify.bind(this);
        this.onPaletteChange = this.onPaletteChange.bind(this);
        this.onSaveImage = this.onSaveImage.bind(this);
        this.onMessageOk = this.onMessageOk.bind(this);

        // Initialize state with default palette.
        this.state = { palette : this.paletteService.defaultPalette()};
    }

    /**
     * Event handler for image loading processes promise and saves loaded image to the state.
     * @param uri URI of the image, either a weblink or base64 encoded image
     */
    onLoadImage(uri){
        this.imageLoadService.loadImage(uri).then(image => {
            this.setState({imageData : image, message: "Image loaded"});

        });
    }


    /**
     *  Event handler for scaling image. After scaling is finished scaled image is saved to the state and possible
     *  clusters of previous scaling are set as null
     * @param width
     * @param height
     */
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

    /**
     * Event handler for finding color cluster from the image, for this operation there must be a scaled image and a
     * palette serving as starting point of the search. When clusters have been found results are saved in state and an
     * image is formed using clusters as a palette
     */
    onClusterify(){
        if (this.state.scaledImage && this.state.palette){
            this.clusterService.k_nearest_neighbours(this.state.scaledImage.toPixels(), this.state.palette).then(
                clusters => {
                    let image = this.state.scaledImage.simplifyPalette(clusters);
                    this.setState({
                        test: image,
                        clusters : clusters,
                        message: "Image clusterified"
                    });
            });
        }
    }

    /**
     * Event handler for a changing a color to another for one of the starting colors.
     * @param paletteColor - new color for palette contains an index of the color to be changed.
     */
    onPaletteChange(paletteColor){
        let palette = this.state.palette;
        palette[paletteColor.index] = paletteColor;
        this.setState({palette : palette});
    }

    /**
     *  Event handler for creating an image from clusterified image and customized palette.
     * @param userClusters - list of clusters with user defined colors for them.
     */
    onSaveImage(userClusters){

        // creates an array from usercluster which is contains only one color for a index and is sorted by index.
        let userClusterMap = R.compose(
                                        R.map(c => R.dissoc('index', c)),
                                        R.sortBy(R.prop('index')),
                                        R.uniqBy(R.prop('index'))
                                      )(userClusters);


        // replaces the cluster color with user defined color in each cluster.
        let clusters = R.map(c => R.merge(c, {centroid : userClusterMap[c.index]}), this.state.clusters);

        // changes a palette of the scaled image.
        let image = this.state.scaledImage.simplifyPalette(clusters);
        this.setState({test: image});
    }

    /**
     * Event handler for message control. Set message to null to hide it.
     */
    onMessageOk(){
        this.setState({message: null});
    }

    /**
     * Renders the application view
     * @returns {*} - Application view
     */
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