const axios = require('axios').default;
const { ACCESS_TOKEN, PROPERTY_TEMPLATE_ID, KK_PATH, MARAMON_2017, MARAMON_2018, MARAMON_2019, MARAMON_2020, BASE_URL } = require('./keys');

//URLs
const LIST_FOLDER_URL = BASE_URL + '/files/list_folder';
const FILE_TEMPL_LINK = BASE_URL + '/files/get_temporary_link';

const HEADER = {
  headers: {
    Authorization: 'Bearer ' + ACCESS_TOKEN,
    'Content-Type': 'application/json',
  },
};

/**
 * Get all songs in the folder along with its properties
 * @param {string} path path of folder
 */
function GetSongs(path) {
  return new Promise(async (resolve, reject) => {
    var body = {
      path: path,
      limit: 1000,
      include_property_groups: {
        '.tag': 'filter_some',
        filter_some: [PROPERTY_TEMPLATE_ID],
      },
    };
    try {
      var result = await axios.post(LIST_FOLDER_URL, body, HEADER);
      var songs = result.data.entries.map((song) => {
        return {
          name: song.name,
          path: song.path_display,
          id: song.id,
          lastModified: new Date(song.client_modified),
          size: song.size,
          properties:
            song.property_groups && song.property_groups.length
              ? song.property_groups[0].fields.map((property) => {
                  var prop = {};
                  prop[property.name] = property.value;
                  return prop;
                })
              : [],
        };
      });
      songs = songs.sort((a, b) => {
        var aOrder = a.properties.Order;
        var bOrder = b.properties.Order;
        if (aOrder && bOrder) {
          return parseInt(aOrder) - parseInt(bOrder);
        } else if (!aOrder && !bOrder) {
          return a.name > b.name ? 1 : -1;
        } else if (!aOrder) {
          return -1;
        } else {
          return 1;
        }
      });
      resolve(songs);
    } catch (err) {
      reject(ErrorHandler(err));
    }
  });
}

/**
 * Creates a temparary link for a file
 * @param {string} path of file
 */
function GetFile(path) {
  return new Promise(async (resolve, reject) => {
    try {
      var body = {
        path: path,
      };
      var result = await axios.post(FILE_TEMPL_LINK, body, HEADER);
      resolve(result.data.link);
    } catch (error) {
      reject(ErrorHandler(error));
    }
  });
}

/**
 * Error Model
 * @param {number} status Status Code
 * @param {string} message error message
 * @param {string} stack stack trace
 */
function RequestError(status, message, stack) {
  this.status = status;
  this.message = message;
  this.stack = stack;
}

/**
 * Handle Errors
 * @param {Exception} err error
 */
function ErrorHandler(err) {
  if (err.response && err.response.data) {
    return new RequestError(err.response.status, err.response.data.error_summary, '');
  } else {
    return new RequestError(500, err.toJSON().message, err.toJSON().stack);
  }
}

module.exports = {
  /**
   * Get links and properties of Kristheeya Keerthanangal
   */
  GetKKSongs: function () {
    return GetSongs(KK_PATH);
  },

  /**
   * Get links and properties for Maramon 2017
   */
  GetMaramon2017Songs: function () {
    return GetSongs(MARAMON_2017);
  },

  /**
   * Get links and properties for Maramon 2018
   */
  GetMaramon2018Songs: function () {
    return GetSongs(MARAMON_2018);
  },

  /**
   * Get links and properties for Maramon 2019
   */
  GetMaramon2019Songs: function () {
    return GetSongs(MARAMON_2019);
  },

  /**
   * Get links and properties for Maramon 2020
   */
  GetMaramon2020Songs: function () {
    return GetSongs(MARAMON_2020);
  },

  /**
   * Get Temparary link for a song
   * @param {string} path path of the song
   */
  GetSong: function (path) {
    return GetFile(path);
  },

  /**
   * Get Temparary link for an album art
   * @param {path} path path of albumart
   */
  GetThumbnail: function (path) {
    return GetFile(path);
  },
};
