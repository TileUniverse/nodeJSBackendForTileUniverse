const express = require('express');

const router = express.Router();
const bluzelle = require('bluzelle');

const UUID = process.env.UUID;

router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
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
            getAllTiles(size, res);
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
    const readMulti = keys => Promise.all(keys.map(bluzelle.read)).then((values) => {
        console.log(values);
        res.json(values);
    });
    readMulti(arrayOfKeys);
}

router.post('/', function (req, res) {
    console.log("body=");
    console.log(req.body);
    console.log(req);
    const x = req.body.x;
    const y = req.body.y;
    let tiles;
    if(req.body.tiles) {
        tiles = JSON.parse(req.body.tiles);
    }
    let data = req.body.data;
    if(data){
        data = data.toString();
    } else {
        data = "";
    }
    console.log(req.body);

    if(x) {
        bluzelle.connect(process.env.SWARM_IP, UUID);

        const key = x.toString() + "," + y.toString();
        console.log(key);

        bluzelle.update(key, data).then(() => {
                console.log(x + "," + y + " updated to: " + data);
                res.json(data);
            },
            error => {
                console.log(error);
                res.json(error);
            });
    } else {
        for(const tile in tiles){
            bluzelle.connect(process.env.SWARM_IP, UUID);

            const key = tile.x + "," + tile.y;
            console.log(key);

            bluzelle.update(key, tile.data).then(() => {
                    console.log(tile.x + "," + tile.y + " updated to: " + tile.data);
                    res.json(tile);
                },
                error => {
                    console.log(error);
                    res.json(error);
                });
        }
    }
});

module.exports = router;
