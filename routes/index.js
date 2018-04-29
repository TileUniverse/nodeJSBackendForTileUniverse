const express = require('express');

const router = express.Router();

const bluzelle = require('bluzelle');

const UUID = process.env.UUID;

let tiles = [];

let now = 0;

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

    now = new Date().getTime();

    bluzelle.connect(process.env.SWARM_IP, UUID);
    bluzelle.create(now, tiles[0]).then(() => {
        console.log("create success");
        readFromBackup(now);
    },
    error => {
        console.log(error);
    })
});

function readFromBackup(timeStamp){
    bluzelle.connect(process.env.SWARM_IP, UUID);
    bluzelle.read(timeStamp).then((value) => {
        console.log("read success");
        },
        error => {
            console.log(error);
        }
    );
}

module.exports = router;
