const express = require('express');
const Dropbox = require('./dropbox');
const logger = require('./logger');
const app = express();

app.get('/album/KristheeyaKeerthanagal', async (req, res, next) => {
  logger.info(`Kristheeya Keerthanagal songs Requested by ${req.ip} `);
  try {
    var songs = await Dropbox.GetKKSongs();
    res.send(songs);
  } catch (error) {
    logger.error(`${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status = error.status;
    res.send('Sorry Something went wrong.');
  }
});

app.get('/album/Maramon2017', async (req, res, next) => {
  logger.info(`Maramon 2017 songs Requested by ${req.ip} `);
  try {
    var songs = await Dropbox.GetMaramon2017Songs();
    res.send(songs);
  } catch (error) {
    logger.error(`${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status = error.status;
    res.send('Sorry Something went wrong.');
  }
});

app.get('/album/Maramon2018', async (req, res, next) => {
  logger.info(`Maramon 2018 songs Requested by ${req.ip} `);
  try {
    var songs = await Dropbox.GetMaramon2018Songs();
    res.send(songs);
  } catch (error) {
    logger.error(`${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status = error.status;
    res.send('Sorry Something went wrong.');
  }
});

app.get('/album/Maramon2019', async (req, res, next) => {
  logger.info(`Maramon 2019 songs Requested by ${req.ip} `);
  try {
    var songs = await Dropbox.GetMaramon2019Songs();
    res.send(songs);
  } catch (error) {
    logger.error(`${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status = error.status;
    res.send('Sorry Something went wrong.');
  }
});

app.get('/album/Maramon2020', async (req, res, next) => {
  logger.info(`Maramon 2020 songs Requested by ${req.ip} `);
  try {
    var songs = await Dropbox.GetMaramon2020Songs();
    res.send(songs);
  } catch (error) {
    logger.error(`${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status = error.status;
    res.send('Sorry Something went wrong.');
  }
});

app.get('/SongLink', async (req, res, next) => {
  var path = req.query.source;
  logger.info(`Song '${path}' Requested by ${req.ip} `);
  if (path) {
    try {
      var link = await Dropbox.GetSong(path);
      res.send(link);
    } catch (error) {
      logger.error(`${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      res.status = error.status;
      res.send('Sorry Something went wrong.');
    }
  }
});

app.get('/AlbumArtLink', async (req, res, next) => {
  var path = req.query.source;
  logger.info(`Album art '${path}' Requested by ${req.ip} `);
  if (path) {
    try {
      var thumbnail = await Dropbox.GetThumbnail(path);
      res.send(thumbnail);
    } catch (error) {
      logger.error(`${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      res.status = error.status;
      res.send('Sorry Something went wrong.');
    }
  }
});

app.listen(3000, function () {
  console.log('Server running');
  logger.info(`Server Started at ${new Date().toString()}`);
});
