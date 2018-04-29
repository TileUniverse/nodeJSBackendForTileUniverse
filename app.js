const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const bluzelle = require('bluzelle');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  // res.render('error');
});

const UUID = process.env.UUID;

initUniverse(10, 10);

function initUniverse(width, height){
    bluzelle.connect(process.env.SWARM_IP, UUID);

    const globalState = {
        "height": height,
        "width": width
    };

    bluzelle.create("global", globalState).then(() => {
            console.log('globalState has been created');
        },
        error => {
            console.log(error);
        });

    const baseTile = {
      "units": [],
      "weather": false
    };

    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            bluzelle.connect(process.env.SWARM_IP, UUID);
            bluzelle.create(x + "," + y, baseTile).then(() => {
                    console.log('tile ' + x + "," + y +' has been created');
                },
                error => {
                    console.log(error);
            });
        }
    }
}

module.exports = app;
