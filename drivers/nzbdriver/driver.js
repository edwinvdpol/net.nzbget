'use strict';

const Homey = require('homey');
const Api = require('../../lib/Api');

class NZBDriver extends Homey.Driver {

  static MINIMUMVERSION = 15;

  // Pairing
  onPair(session) {
    this.log('Pairing started');

    session.setHandler('connect', async data => {
      this.log('Connecting to server...');

      // Merge data with defaults
      data = this.mergeData(data);

      const version = await new Api(data, this.homey).version().catch(err => {
        throw new Error(err.message);
      });

      if (Number(version) < this.constructor.MINIMUMVERSION) {
        throw new Error(this.homey.__('api.version', { version }));
      }

      await session.emit('create', {
        name: `NZBGet v${version}`,
        data,
      });
    });
  }

  // Merge data with defaults
  mergeData(data) {
    return {
      host: data.host || 'http://127.0.0.1',
      user: data.user || 'nzbget',
      pass: data.pass || 'tegbzn6789',
      port: data.port || 6789,
    };
  }

}

module.exports = NZBDriver;
