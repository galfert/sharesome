import EmberObject from '@ember/object';
import Route from '@ember/routing/route';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Route.extend({

  remotestorage: service(),
  rs: alias('remotestorage.rs'),
  rsConnected: alias('remotestorage.connected'),

  beforeModel() {
    if (!this.get('rsConnected')) {
      this.transitionTo('index');
    }
  },

  model() {
    return this.get('rs').shares.list().then((listing) => {
      let filenames = Object.keys(listing);
      let shares = [];

      filenames.forEach((filename) => {
        let url;
        try {
          url = this.get('rs').shares.getFileURL(filename)
        } catch(error) {
          url = '';
        }
        let item = EmberObject.create({
          id: filename,
          name: filename,
          url: url,
          isDeleting: false
        });
        shares.pushObject(item);
      });

      return shares;
    });
  }

});
