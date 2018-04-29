const express = require('express');

const router = express.Router();

let tiles = [];

initUniverseInMemory(10, 10);

function initUniverseInMemory(width, height) {

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const baseTile = {
                "units": [],
                "weather": false,
                "x": x,
                "y": y
            };
            tiles.push(baseTile);
        }
    }
}

router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    res.json(tiles);
});

router.post('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("body=");
    console.log(req.body);
    if(req.body.tiles) {
        updatedTiles = JSON.parse(req.body.tiles);
    }
    const field = req.body.field;

    updatedTiles.forEach(function(tile){
        tiles = tiles.map(function(realTile){
            if(realTile.x === tile.x && realTile.y === tile.y){
                realTile[field] = tile[field];
            }
            return realTile;
        })
    });
    res.json(tiles);
});

module.exports = router;
