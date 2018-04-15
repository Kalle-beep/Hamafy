var R = require('ramda');

/**
 * Class for defining palettes
 */
export default class PaletteService{

    defaultPalette(){
        return this._indexPalette([
            {r: 255, g: 0, b: 0, a : 255},   // Red
            {r: 255, g: 127, b: 0, a : 255}, // Orange
            {r: 255, g: 255, b: 0, a : 255}, // Yellow
            {r: 127, g: 255, b: 0, a : 255}, // Chartreuse Green
            {r: 0, g: 255, b: 0, a : 255},   // Green
            {r: 0, g: 255, b: 127, a : 255}, // Spring Green
            {r: 0, g: 255, b: 255, a : 255}, // Cyan
            {r: 0, g: 127, b: 255, a : 255}, // Azure
            {r: 0, g: 0, b: 255, a : 255}, // Blue
            {r: 127, g: 0, b: 255, a : 255}, // Violet
            {r: 255, g: 0, b: 255, a : 255}, // Magenta
            {r: 255, g: 0, b: 127, a : 255}, // Rose
            {r: 255, g: 255, b: 255, a : 255}, // White
            {r: 0, g: 0, b: 0, a : 255}, // Black
            {r: 127, g: 127, b: 127, a : 255}, // Gray
            {r: 0, g: 0, b: 0, a : 0},      // Transparent

        ]);
    }

    /**
     * Adds index in each color in palette.
     * @param palette
     * @returns {*}
     * @private
     */
    _indexPalette(palette){
        return R.addIndex(R.map)((val, i)=> {return R.merge({index : i}, val)}, palette);
    }
}