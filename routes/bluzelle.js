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
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log("body=");
    console.log(req.body);
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

    if(x) {
        bluzelle.connect(process.env.SWARM_IP, UUID);

        const key = x.toString() + "," + y.toString();
        console.log(key);

        bluzelle.update(key, data).then(() => {
                console.log(x + "," + y + " individually updated to: " + data);
            },
            error => {
                console.log(error);
            });
    } else {
        for(let i = 0; i < tiles.length; i++){
            bluzelle.connect(process.env.SWARM_IP, UUID);

            const key = tiles[i].x + "," + tiles[i].y;
            console.log("key=");
            console.log(key);
            console.log("tiles[" + i + "]");
            console.log(tiles[i]);
            console.log("JSON.stringify(tiles[i])");
            console.log(tiles[i]);

            bluzelle.update(key, tiles[i]).then(() => {
                    console.log(key + " bulk updated to: " + JSON.stringify(tiles[i]));
                },
                error => {
                    console.log(error);
                    console.log(key + " bulk updated FAILED: " + JSON.stringify(tiles[i]));
                });
        }
    }
    res.json(tiles);
});

module.exports = router;
