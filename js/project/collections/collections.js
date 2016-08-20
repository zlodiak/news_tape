APP.NewsModelsCollection = Backbone.Collection.extend({
  
  model: APP.NewsModel,

  search: function(letters) {
    if (letters == "") { return this.models };

    var pattern = new RegExp(letters, "gi");
    var filtered = this.filter(function(model) {
      return model.get('title').indexOf(letters) > -1;
    });

    return filtered;
  }

});