const express = require('express');
const router = express.Router();
const bluzelle = require('bluzelle');

router.get('/', function(req, res, next) {
    const UUID = "someUUID";
    const someString = "someString";
    bluzelle.connect(process.env.SWARM_IP, UUID);

    bluzelle.read('key').then((value) => {
        console.log("value:" + value);
        res.json(value);
    },
    error => {
        console.log(error);
        res.json(error);
    });
});

router.post('/', function (req, res) {
    const UUID = "someUUID";
    const someString = "someString";
    bluzelle.connect(process.env.SWARM_IP, UUID);

    bluzelle.create('key', someString).then(() => {
        console.log('key has been created');
    },
    error => {
        console.log(error);
    });
});

module.exports = router;
