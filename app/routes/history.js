import Ember from 'ember';

export default Ember.Route.extend({

  storage: Ember.inject.service(),

  beforeModel() {
    if (!this.get('storage.connected')) {
      this.transitionTo('index');
    }
  },

  model() {
    return this.get('storage').getFileListing().then((listing) => {
      let filenames = Object.keys(listing);
      let shares = [];

      filenames.forEach((filename) => {
        let item = Ember.Object.create({
          name: filename,
          url: this.get('storage').getFileURL(filename),
          isDeleting: false
        });
        shares.pushObject(item);
      });

      return shares;
    });
  }

});
