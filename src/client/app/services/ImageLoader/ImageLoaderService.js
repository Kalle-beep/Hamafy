/**
 * Service for loading images asynchroniuosly form web using virtual canvas and image.
 */
export default class ImageLoaderService {
    constructor(){

    }

    /**
     * loads an image based on uri. Uri is set as a source for virtual image object. During the onload event image is
     * drawn into virtual canvas and its points are read as an array from the canvas.
     * @param uri
     * @returns {Promise<any>}
     */
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

            // images from cross origin source are okay for us
            image.setAttribute('crossOrigin', '');
            image.src = uri;
        });

        return promise;
    }
}