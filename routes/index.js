const express = require('express');
const router = express.Router();
const bluzelle = require('bluzelle');

const UUID = process.env.UUID;

router.get('/', function(req, res, next) {
    const x = req.query.x;
    const y = req.query.y;

    if(x) {
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
        bluzelle.connect(process.env.SWARM_IP, UUID);
        bluzelle.read("global").then((size) => getAllTiles(size)).then((allTiles) => sendAllTiles(allTiles, res)); //this obviously doesn't work
    }
});

function getAllTiles(size, res){
    let allTiles;
    for(let x = 0; x < size.x; x++){
        for(let y = 0; y < size.y; y++){
            bluzelle.connect(process.env.SWARM_IP, UUID);

            bluzelle.read(x + "," + y).then((value) => {
                    console.log(x + "," + y + ":" + value);
                    // res.json(value);
                    allTiles.add(value);
                },
                error => {
                    console.log(error);
                    res.json(error);
                }
            );
        }
    }
}

function sendAllTiles(allTiles, res){
    res.json(allTiles);
}

router.post('/', function (req, res) {
    const x = req.body.x;
    const y = req.body.y;
    const tiles = req.body.tiles;
    const data = req.body.data;
    console.log(req);

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
