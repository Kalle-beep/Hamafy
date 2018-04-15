/**
 * Service for scaling image to smaller dimensions
 */
export default class ImageScaleService{
    constructor(imageModelFactory){
        this.imageModelFactory = imageModelFactory;
    }

    /**
     * Scales imagedata object to gicen dimensions pixel image. by rasterification of a larger image and calculating
     * an average color for each raster.
     * @param imageData
     * @param width
     * @param height
     * @returns {Promise<any>} - scaled image as pixels
     */
    scale(imageData, width, height){
        let promise = new Promise((resolve, reject) => {
            let length = width*height;
            let pixels = [];

            // calculates factors for scaled image
            let xf = imageData.width / width,
                yf = imageData.height / height;

            for (let i=0;i<length;++i){
                // resolve pixel's upper left x and y coordinate in original image.
                let x = Math.floor((i - Math.floor(i/width)*width)*xf);
                let y = Math.floor(Math.floor(i/width)*yf);

                let pixel = this._calculateAverage(imageData, x, y, xf, yf);

                pixels.push(pixel);
            }

            resolve(this.imageModelFactory.createFromPixels(pixels, width, height));
        });

        return promise;
    }

    /**
     * CAlculates average value for pixels in the area.
     * @param imageData
     * @param x
     * @param y
     * @param w
     * @param h
     * @returns {{r: number, g: number, b: number, a: number}}
     * @private
     */
    _calculateAverage(imageData, x, y, w, h){
        let pixel = {r: 0, g:0, b:0, a:0};
        let count = Math.ceil(w)*Math.ceil(h);

        for (let i=x;i<x+w;i+=1){
            for (let j=y;j<y+h;j+=1){
                pixel.r += imageData.data[i*4+j*imageData.width*4];
                pixel.g += imageData.data[i*4+j*imageData.width*4 + 1];
                pixel.b += imageData.data[i*4+j*imageData.width*4 + 2];
                pixel.a += imageData.data[i*4+j*imageData.width*4 + 3];
            }
        }


        pixel.r = parseInt((pixel.r/count).toFixed(0));
        pixel.g = parseInt((pixel.g/count).toFixed(0));
        pixel.b = parseInt((pixel.b/count).toFixed(0));
        pixel.a = parseInt((pixel.a/count).toFixed(0));

        return pixel;
    }
}