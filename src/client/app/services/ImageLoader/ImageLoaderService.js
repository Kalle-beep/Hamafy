export default class ImageLoaderService {
    constructor(){

    }

    loadImage(uri){
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        let promise = new Promise((resolve, reject) => {
            let image = new Image();
            image.onload = () =>{
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0);
                let data = context.getImageData(0, 0, image.width, image.height);
                resolve(data);
            }
            image.setAttribute('crossOrigin', '');
            image.src = uri;
        });

        return promise;
    }
}