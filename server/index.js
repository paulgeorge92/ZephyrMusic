const credentials = require('./dropbox');
const Dropbox = require('dropbox').Dropbox;
const url = require('url');
const queryString = require('querystring');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const dropbox = require('./dropbox');
const { createContext } = require('vm');
const axios = require('axios').default;

const app = express();
const dbx = new Dropbox({
  accessToken: credentials.TOKEN,
  clientId: credentials.CLIENT_ID,
  clientSecret: credentials.CLIENT_SECRET,
});

app.get('/listapi', async (req, res, next) => {
  var start = new Date();
  var body = {
    path: dropbox.KK_PATH,
    limit: 1000,
    include_property_groups: {
      '.tag': 'filter_some',
      filter_some: [dropbox.PROPERTY_TEMPLATE_ID],
    },
  };

  try {
    var result = await axios.post('https://api.dropboxapi.com/2/files/list_folder', body, {
      headers: {
        Authorization: 'Bearer ' + dropbox.TOKEN,
        'Content-Type': 'application/json',
      },
    });
    var songs = result.data.entries.map((song) => {
      return {
        name: song.name,
        path: song.path_display,
        id: song.id,
        lastModified: new Date(song.client_modified),
        size: song.size,
        properties: song.property_groups && song.property_groups.length ? song.property_groups[0].fields : [],
      };
    });
    songs = songs.sort((a, b) => {
      var aOrder = a.properties.find((x) => x.name == 'Order');
      var bOrder = b.properties.find((x) => x.name == 'Order');
      if (aOrder && bOrder) {
        return parseInt(aOrder.value) - parseInt(bOrder.value);
      } else if (!aOrder && !bOrder) {
        return a.name > b.name ? 1 : -1;
      } else if (!aOrder) {
        return -1;
      } else {
        return 1;
      }
    });
    res.send(
      JSON.stringify({
        start: start.toString(),
        end: new Date().toString(),
        totalFiles: result.data.entries.length,
        //songs: songs,
      })
    );
    //console.log(result);
    //res.send(JSON.stringify(result.data));
  } catch (err) {
    res.send(JSON.stringify(err.response));
  }
});

app.get('/template', (req, res, next) => {
  dbx
    .filePropertiesTemplatesAddForUser({
      name: 'TestTemplate',
      description: 'Test',
      fields: [
        {
          name: 'TestProp',
          description: 'Test Prop',
          type: 'string',
        },
      ],
    })
    .then(
      (_res) => {
        res.send(JSON.stringify(_res));
      },
      (err) => {
        res.send(JSON.stringify(err));
      }
    );
});

app.get('/addProperty', function (req, res, next) {
  dbx
    .filePropertiesPropertiesAdd({
      path: 'id:pQLPUsGgetcAAAAAAAEQzQ',
      property_groups: [
        {
          template_id: 'ptid:ktmxOWa7VZgAAAAAAAA0kQ',
          fields: [
            {
              name: 'TestProp',
              value: 'Test Album',
            },
          ],
        },
      ],
    })
    .then(
      (_res) => {
        res.send('Property Added');
      },
      (err) => {
        res.send(JSON.stringify(err));
      }
    );
});

app.listen(3000, function () {
  console.log('Server running');
});
