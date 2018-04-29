const express = require('express');
const router = express.Router();
const bluzelle = require('bluzelle');

const UUID = process.env.UUID;

router.get('/', function(req, res, next) {
    const x = req.query.x;
    const y = req.query.y;
    bluzelle.connect(process.env.SWARM_IP, UUID);

    bluzelle.read(x + "," + y).then((value) => {
        console.log(x + "," + y + ":" + value);
        res.json(value);
    },
    error => {
        console.log(error);
        res.json(error);
    });
});

router.post('/', function (req, res) {
    const x = req.body.x;
    const y = req.body.y;
    const tiles = req.body.tiles;
    const data = req.body.data;

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
