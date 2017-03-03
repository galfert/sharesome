import Ember from 'ember';
import RemoteStorage from 'npm:remotestoragejs';
import 'npm:remotestorage-widget';
import 'npm:remotestorage-module-shares';

export default Ember.Service.extend({

  connected: false,
  connecting: false,
  remoteStorage: null,

  init() {
    this._super(...arguments);

    this.set('remoteStorage', new RemoteStorage({cache: false}));
    this.setup();
  },

  setup() {
    // RemoteStorage.WireClient.REQUEST_TIMEOUT = 90000;

    this.get('remoteStorage').access.claim('shares', 'rw');
    this.get('remoteStorage').displayWidget({ domID: 'remotestorage-connect', redirectUri: window.location.href });

    this.get('remoteStorage').on('ready', () => {
      console.log('RS ready');
      this.setProperties({
        'connecting': false,
        'connected': true
      });
    });
    this.get('remoteStorage').on('not-connected', () => {
      console.log('RS not-connected');
      this.setProperties({
        'connecting': false,
        'connected': false
      });
    });
    this.get('remoteStorage').on('connected', () => {
      console.log('RS connected');
      this.setProperties({
        'connecting': false,
        'connected': true
      });
    });
    this.get('remoteStorage').on('disconnected', () => {
      console.log('RS disconnected');
      this.setProperties({
        'connecting': false,
        'connected': false
      });
    });
    this.get('remoteStorage').on('connecting', () => {
      console.log('RS connecting');
      this.setProperties({
        'connecting': true,
        'connected': false
      });
    });
    this.get('remoteStorage').on('authing', () => {
      console.log('RS authing');
      this.setProperties({
        'connecting': true,
        'connected': false
      });
    });
  },

  storeFile(type, name, data) {
    return this.get('remoteStorage').shares.storeFile(type, name, data);
  },

  removeShare(name) {
    return this.get('remoteStorage').shares.remove(name);
  },

  getThumbnailURL(name) {
    return this.get('remoteStorage').shares.getThumbnailURL(name);
  },

  getFileURL(name) {
    return this.get('remoteStorage').shares.getFileURL(name);
  },

  getFileListing() {
    return this.get('remoteStorage').shares.list();
  }

});
