var HistoryController = Ember.ArrayController.extend({
  content        : [],
  sortProperties : ['name'],
  sortAscending  : false,

  loadItems: function() {
    this.set('content', []); //TODO this shouldn't be loaded on every insert

    var self = this;
    console.log('loading items');

    remoteStorage.shares.list().then(function(listing){
      Object.keys(listing).forEach(function(filename){
        var item = Ember.Object.create({
          name: filename,
          url: remoteStorage.shares.getFileURL(filename),
          isDeleting: false
        });
        self.pushObject(item);
      });
    });
  },

  itemCount: function() {
    return this.get('content').length;
  }.property('content.@each'),

  removeItem: function(propName, value) {
    var obj = this.findProperty(propName, value);
    this.removeObject(obj);
  },

  actions: {

    zoom: function(url) {
      var isImage = url.match(/(jpg|jpeg|png|gif|webp)$/i);
      var dialogContent;
      if (isImage) {
        dialogContent = "<img src='"+url+"' class='zoomed'>";
      } else {
        dialogContent = "No preview available.";
      }
      window.vex.dialog.alert(dialogContent);
    },

    share: function(url) {
      window.vex.dialog.alert("Direct URL:<p><input type='text' value='"+url+"'>");
      $('.vex-content input').first().select();
    },

    remove: function(name) {
      var self = this;
      var item = this.findProperty('name', name);
      item.set('isDeleting', true);

      remoteStorage.shares.remove(name).then(
        function() {
          self.removeObject(item);
        },
        function(e) {
          item.set('isDeleting', false);
          window.alert("Couldn't remove item. Please try again. Sorry!");
          console.log(e);
        }
      );
    }

  }
});

export default HistoryController;
