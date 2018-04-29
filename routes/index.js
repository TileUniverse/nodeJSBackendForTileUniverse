const express = require('express');
const router = express.Router();
const bluzelle = require('bluzelle');

const UUID = process.env.UUID;

router.get('/', function(req, res, next) {
    const x = req.query.x;
    const y = req.query.y;

    if(x) {
        console.log(x);
        bluzelle.connect(process.env.SWARM_IP, UUID);

        bluzelle.read(x + "," + y).then((value) => {
                console.log(x + "," + y + ":" + value);
                res.json(value);
            },
            error => {
                console.log(error);
                res.json(error);
                }
            );
    } else {
        console.log("global request");
        bluzelle.read("global").then((size) => {
            console.log(size);
            getAllTiles(size, res)
        });
    }
});

function getAllTiles(size, res){
    console.log("get all tiles");
    let arrayOfKeys = [];
    for(let x = 0; x < size.width; x++){
        for(let y = 0; y < size.height; y++){
            arrayOfKeys.push(x + "," + y);
        }
    }
    console.log(arrayOfKeys);
    const readMulti = keys => Promise.all(keys.map(bluzelle.read)).then((values) => res.json(values));
    readMulti(arrayOfKeys);
}

function sendAllTiles(allTiles, res){
    res.json(allTiles);
}

router.post('/', function (req, res) {
    const x = req.body.x;
    const y = req.body.y;
    const tiles = JSON.parse(req.body.tiles);
    const data = req.body.data;
    console.log(req.body);

    if(x) {
        bluzelle.connect(process.env.SWARM_IP, UUID);

        bluzelle.update(x + "," + y, data).then(() => {
                console.log(x + "," + y + " updated to: " + data);
            },
            error => {
                console.log(error);
            });
    } else {
        for(const tile in tiles){
            bluzelle.connect(process.env.SWARM_IP, UUID);

            bluzelle.update(tile.x + "," + tile.y, tile.data).then(() => {
                    console.log(tile.x + "," + tile.y + " updated to: " + tile.data);
                },
                error => {
                    console.log(error);
                });
        }
    }
});

module.exports = router;
