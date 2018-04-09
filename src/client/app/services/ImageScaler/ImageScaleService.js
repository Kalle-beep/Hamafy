export default class ImageScaleService{
    constructor(imageModelFactory){
        this.imageModelFactory = imageModelFactory;
    }

    scale(imageData, width, height){
        let promise = new Promise((resolve, reject) => {
            let scaledImage = new ImageData(width, height);
            let pixels = [];

            let xf = imageData.width / width,
                yf = imageData.height / height;

            for (let i=0;i<scaledImage.data.length;i+=4){
                let iPixel = i / 4;
                let x = Math.floor((iPixel - Math.floor(iPixel/width)*width)*xf);
                let y = Math.floor(Math.floor(iPixel/width)*yf);

                let pixel = this._calculateAverage(imageData, x, y, xf, yf);

                pixels.push(pixel);

                // scaledImage.data[i] = pixel.r;
                // scaledImage.data[i+1] = pixel.g;
                // scaledImage.data[i+2] = pixel.b;
                // scaledImage.data[i+3] = pixel.a;
            }


            resolve(this.imageModelFactory.createFromPixels(pixels, width, height));
        });

        return promise;
    }

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