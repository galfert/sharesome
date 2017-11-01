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

  model(params) {
    return this.get('rs').shares.client.getFile(params.item_id).then((file) => console.log('file', file));
  }

});
