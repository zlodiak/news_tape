APP.NewsModelsCollection = Backbone.Collection.extend({
  model: APP.NewsModel,

  search : function(letters){
    if(letters == "") return this;
    
    var pattern = new RegExp(letters,"gi");
    return _(this.filter(function(data) {
        return pattern.test(data.get("name"));
    }));
  }  
});