const R = require('ramda');

export default class ClusterifyService{

    _clusterify(pixels, startingPoints){
        let means = startingPoints.map(m => R.merge(m, {points :[]})),
            k = startingPoints.length;

        for (let i=0;i<pixels.length;++i) {
            let p = pixels[i],
                minDistance = Number.MAX_VALUE,
                kIndex = 0;

            let point = means.map(m => { return {
                    "d" : this._sqrdistance(m.centroid, pixels[i]),
                    "m" : m
                }}).reduce((acc, val) => acc.d > val.d?val:acc, { d: Number.MAX_VALUE });

            point.m.points.push(p);
        }

        return means.map(m => R.merge(m, {'centroid' : this._centroid(m.points)}));
    }

    _sqrdistance(p1, p2){
        return Object.keys(p1) .map((k) =>  { return ((p1[k]-p2[k]) ** 2);  }).reduce((acc, val)=> acc + val, 0);
    }
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

    k_nearest_neighbours(pixels, startingpoints){

        let promise = new Promise((resolve, reject) => {

            let prevMeans = R.map(p => {return {centroid : R.pick(['r','g','b', 'a'], p)};},startingpoints);
            let colors = R.uniq(pixels);
            let ready = false;
            let i = 0;
            do {
                let currentMeans = this._clusterify(pixels, prevMeans);
                /*currentMeans.forEach(m => {
                    console.log(m.centroid.r, m.centroid.g, m.centroid.b, m.points.length);
                });
                console.log(" ");*/

                ready = R.all(b => b === true, R.zipWith(R.eqProps('centroid'), prevMeans, currentMeans));

                prevMeans = currentMeans;
            } while (!ready && ++i < 100);

            let r = R.compose(
                R.addIndex(R.map)((val, i)=> {return R.merge({index : i}, val)}),
                R.filter(m => m.points.length > 0)
                )(prevMeans);
            resolve(r);
        });

        return promise;
    }


}