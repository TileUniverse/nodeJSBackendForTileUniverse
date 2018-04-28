var express = require('express');
var router = express.Router();
const bluzelle = require('bluzelle');

/* GET home page. */
router.get('/', function(req, res, next) {
    const UUID = "someUUID";
    const someString = "someString";

    bluzelle.connect(process.env.SWARM_IP, UUID);

    bluzelle.create('key', someString).then(() => {
        console.log('key has been created');
    });
});

module.exports = router;
