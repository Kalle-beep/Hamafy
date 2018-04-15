const R = require('ramda');

/**
 * Service for doing k-nearest-neighbours algorithm to pixels of an image
 */
export default class ClusterifyService{

    /**
     * assigns each pixel to closest existing cluster
     * @param pixels - pixels from the image
     * @param startingPoints - center point where pixels are assigned.
     * @returns centroid containg list of pixels assigned to them.
     * @private
     */
    _clusterify(pixels, startingPoints){
        // merges empty points list where pixels arte assigned, and select value of k from length of the starting
        // points.
        let means = startingPoints.map(m => R.merge(m, {points :[]})),
            k = startingPoints.length;

        for (let i=0;i<pixels.length;++i) {
            let p = pixels[i];

            // finds closest centroid for a pixel
            let centroid = means.map(m => { return {
                    "d" : this._sqrdistance(m.centroid, pixels[i]),
                    "m" : m
                }}).reduce((acc, val) => acc.d > val.d?val:acc, { d: Number.MAX_VALUE });

            // assigns pixel to centroid's points list
            centroid.m.points.push(p);
        }

        // Calculates new centroids for points assigned to those.
        return means.map(m => R.merge(m, {'centroid' : this._centroid(m.points)}));
    }

    /**
     * calculates squared distance between teo objects
     * @param p1 - pixel
     * @param p2 - pixel
     * @returns squared distance between objects
     * @private
     */
    _sqrdistance(p1, p2){
        return Object.keys(p1) .map((k) =>  { return ((p1[k]-p2[k]) ** 2);  }).reduce((acc, val)=> acc + val, 0);
    }

    /**
     * calculates a center for points assigned to this cluster
     * @param points
     * @returns {{r: number, g: number, b: number, a: number}}
     * @private
     */
    _centroid(points){
        var c = {r: 0, g:0, b:0, a:0};
        for (var i =0;i<points.length;++i){
            c.r += parseInt(points[i].r);
            c.g += parseInt(points[i].g);
            c.b += parseInt(points[i].b);
            c.a += parseInt(points[i].a);
        }

        c.r=parseInt(c.r / points.length);
        c.g=parseInt(c.g / points.length);
        c.b=parseInt(c.b / points.length);
        c.a=parseInt(c.a / points.length);

        return c;
    }

    /**
     * Assigns pixels to clusters using given set of the starting points, because operation might take a while
     * UI is not blocked and the promise is return which is processed when operation is ready. Operation is done until
     * there are no changes during the iteration or iteration has done for 100 times
     * @param pixels
     * @param startingpoints
     * @returns {Promise<any>} - List of calculated clustgers with points assigned to them.
     */
    k_nearest_neighbours(pixels, startingpoints){

        let promise = new Promise((resolve, reject) => {
            // creates rgba values from starting points
            let prevMeans = R.map(p => {return {centroid : R.pick(['r','g','b', 'a'], p)};},startingpoints);
            let ready = false;
            //counter for done iterations to avoid for ever lasting loops
            let i = 0;

            do {
                // assigns pixels in clusters
                let currentMeans = this._clusterify(pixels, prevMeans);

                // centroids haven't change during the iteration operation is ready.
                ready = R.all(b => b === true, R.zipWith(R.eqProps('centroid'), prevMeans, currentMeans));

                prevMeans = currentMeans;
            } while (!ready && ++i < 100);

            //remove all clusters without pixels and add index to rest.
            let r = R.compose(
                R.addIndex(R.map)((val, i)=> {return R.merge({index : i}, val)}),
                R.filter(m => m.points.length > 0)
                )(prevMeans);
            resolve(r);
        });

        return promise;
    }


}