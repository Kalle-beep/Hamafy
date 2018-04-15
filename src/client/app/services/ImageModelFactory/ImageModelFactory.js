const R = require('ramda');

/**
 * factory for creating images with custom palettes from pixels.
 */
export default class ImageModelFactory{
    createFromPixels(pixels, width, height){
        return new ImageModel(this._clusterifyPixels(pixels, width, height));
    }

    /**
     * creates a palette from image presented by pixel objects.
     * @param pixels
     * @param width
     * @param height
     * @returns {{data: Array, palette: Array, width: *, height: *}}
     * @private
     */
    _clusterifyPixels(pixels, width, height){
        let palette = [];
        let clusterifiedImage = {
            data:[],
            palette : [],
            width: width,
            height: height
        };
        let colorIndex = 0;

        for (let i=0;i<pixels.length;++i){
             let pixel = pixels[i];

            // converts pixel to string for easy identifying
             let id = this._pixelToCluster(pixel);

            // if color not exists in palette color is added and index is increased.
             if (!palette[id]){
                palette[id] = {
                    pixel: pixel,
                    index : colorIndex
                };
                 ++colorIndex;
            }

            // pixel is added to image array as an palette index.
            clusterifiedImage.data.push(palette[id].index);
        }

        // creates an array from palette.
        clusterifiedImage.palette = R.compose(
            R.map(p => p.pixel),
            R.sortBy(p => p.index),
            R.map(k => palette[k]),
            R.keys
        )(palette);

        return clusterifiedImage;
    }

    /**
     * Concanates pixel values together to identify them.
     * @param pixel
     * @returns {string}
     * @private
     */
    _pixelToCluster(pixel){
        return pixel.r.toString()+pixel.g.toString()+pixel.b.toString();
    }
}

/**
 * Model for image with custom palette which can be converted to imagedata and pixel form.
 */
class ImageModel{
    constructor(clusterifiedImage){
        this.data = clusterifiedImage.data;
        this.palette = clusterifiedImage.palette;
        this.width = clusterifiedImage.width;
        this.height = clusterifiedImage.height;
    }

    /**
     * Creates a correct size imagedata object and assigns pixels to it byte by byte.
     * @returns {ImageData}
     */
    toImageData(){
        let data = new ImageData(this.width, this.height);

        for (let i=0;i<this.data.length;++i){
            let dataIndex = 4*i;

            let pixel = this._toPixel(this.data[i]);
            data.data[dataIndex] = pixel.r;
            data.data[dataIndex+1] = pixel.g;
            data.data[dataIndex+2] = pixel.b;
            data.data[dataIndex+3] = (!pixel.a && pixel.a !== 0)?255:pixel.a;
        }
        return data;
    }

    /**
     * coverts palette index value array to pixel array.
     * @returns {*}
     */
    toPixels(){
        return R.map(p => this._toPixel(p), this.data);
    }

    /**
     * resolves palette color for palette index
     * @param cluster
     * @returns {*}
     * @private
     */
    _toPixel(cluster){
        return this.palette[cluster];
    }

    /**
     * Assign colors into to new palette.
     * @param clusters
     * @returns {ImageModel}
     */
    simplifyPalette(clusters)
    {
        // creates a map from pixels belonging to clusters to return cluster color for each color belonging to it
        let colorMap = R.reduce((acc, c) => R.assoc(c.color, c.centroid, acc), {},R.unnest(R.map(c => R.map(p => ({'centroid': c.centroid, 'color': this._toPixelHash(p)}), c.points), clusters)));
        let palette = R.map((c, i) => c.centroid, clusters);

        // maps each pixel to its cluster color index.
        let pixels = R.map(p => {
            let color = colorMap[this._toPixelHash(p)];
            return R.indexOf(color, palette)}, this.toPixels());

        return new ImageModel({
            data : pixels,
            palette : palette,
            width : this.width,
            height : this.height
        });
    }

    /**
     * calculates a hash from pixel color values. Because JavaScript bitshift works only with signed 32-bit integers
     * it has to been done with multiplication.
     * @param pixel
     * @returns {*|number}
     * @private
     */
    _toPixelHash(pixel){
        let hash = 0;
        hash = pixel.r;
        hash *=256;
        hash+=pixel.g;
        hash *=256;
        hash+=pixel.b;
        hash *=256;
        hash+=pixel.a;

        return hash;
    }
}