export default class ImageScaleService{
    constructor(){

    }

    scale(imageData, width, height){
        let promise = new Promise((resolve, reject) => {
            let scaledImage = new ImageData(width, height);

            let xf = Math.floor(imageData.width / width),
                yf = Math.floor(imageData.height / height);

            for (let i=0;i<scaledImage.data.length;i+=4){
                let iPixel = i / 4;
                let x = (iPixel - Math.floor(iPixel/width)*width)*xf+1;
                let y = Math.floor(iPixel/width)*yf+1;

                let pixel = this._calculateAverage(imageData, x, y, xf, yf);

                scaledImage.data[i] = pixel.r;
                scaledImage.data[i+1] = pixel.g;
                scaledImage.data[i+2] = pixel.b;
                scaledImage.data[i+3] = pixel.a;
            }
            resolve(scaledImage);
        });

        return promise;
    }

    _calculateAverage(imageData, x, y, w, h){
        let pixel = {r: 0, g:0, b:0, a:255}
        for (let i=x;i<x+w;i+=1){
            for (let j=y;j<y+h;j+=1){
                pixel.r += imageData.data[i*4+j*imageData.width*4];
                pixel.g += imageData.data[i*4+j*imageData.width*4 + 1];
                pixel.b += imageData.data[i*4+j*imageData.width*4 + 2];
                pixel.a += imageData.data[i*4+j*imageData.width*4 + 3];
            }
        }

        pixel.r = pixel.r/w/h;
        pixel.g = pixel.g/w/h;
        pixel.b = pixel.b/w/h;
        pixel.a = pixel.a/w/h;

        return pixel;
    }
}