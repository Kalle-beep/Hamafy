const R = require('ramda');

export default class ImageModelFactory{
    createFromImageData(imageData){
        return new ImageModel(this._clusterifyImageData(imageData));
    }

    createFromPixels(pixels, width, height){
        return new ImageModel(this._clusterifyPixels(pixels, width, height));
    }

    _clusterifyImageData(imageData){

        let palette = [];
        let clusterifiedImage = {
            data:[],
            palette : [],
            width: imageData.width,
            height: imageData.height
        };
        let colorIndex = 0;
        for (let i =0;i<imageData.data.length;i+=4){
            let pixel = {
                r : data[i],
                g : data[i+1],
                b : data[i+2],
                a : data[i+3]
            };
            let id = this._pixelToCluster(pixel);

            if (!palette[id]){
                ++colorIndex;
                palette[id] = {
                    pixel: pixel,
                    index : colorIndex
                };
            }

            clusterifiedImage.data.push(palette[id].index);
        }

        clusterifiedImage.palette = R.compose(
            R.map(p => p.pixel),
            R.sortBy(p => p.index)
        )(palette);

        return clusterifiedImage;
    }
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
             let id = this._pixelToCluster(pixel);

             if (!palette[id]){
                palette[id] = {
                    pixel: pixel,
                    index : colorIndex
                };
                 ++colorIndex;
            }

            clusterifiedImage.data.push(palette[id].index);
        }

        clusterifiedImage.palette = R.compose(
            R.map(p => p.pixel),
            R.sortBy(p => p.index),
            R.map(k => palette[k]),
            R.keys
        )(palette);

        return clusterifiedImage;
    }

    _pixelToCluster(pixel){
        return pixel.r.toString()+pixel.g.toString()+pixel.b.toString();
    }


}

class ImageModel{
    constructor(clusterifiedImage){
        this.data = clusterifiedImage.data;
        this.palette = clusterifiedImage.palette;
        this.width = clusterifiedImage.width;
        this.height = clusterifiedImage.height;
    }

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

    toPixels(){
        return R.map(p => this._toPixel(p), this.data);
    }

    _toPixel(cluster){
        return this.palette[cluster];
    }

    simplifyPalette(clusters)
    {
        let colorMap = R.reduce((acc, c) => R.assoc(c.color, c.centroid, acc), {},R.unnest(R.map(c => R.map(p => ({'centroid': c.centroid, 'color': this._toPixelHash(p)}), c.points), clusters)));
        let palette = R.map((c, i) => c.centroid, clusters);

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