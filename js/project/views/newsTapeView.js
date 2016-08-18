APP.NewsTapeView = Backbone.View.extend({  

  initialize: function() {   
    this.collection = new APP.NewsModelsCollection();  
    this._fillCollection();
        
    this.render();
  },    

  template: _.template($('#newsTapeTpl').html()),

  render: function () {  
    this.$el.html(this.template());    
    this._createNewsUnits();

    return this;
  },

  _createNewsUnits: function () {  
    _.each(this.collection, function (news) {
      $(this.el).append(new APP.NewsUnitView({model:news}).render().el);
    }, this);
  },

  _fillCollection: function () {  
    var self = this;

    $.each(APP.CONFIG.values, function(key, val) {    
      //console.log(val.title);
      //console.log(val.description);
      //console.log(val.poster);

      var newsModel = new APP.NewsModel({
        title: val.title,
        description: val.description,
        poster: val.poster
      });

      self.collection.add(newsModel);
    });

    console.log(this.collection);
  }  

});



APP.NewsUnitView = Backbone.View.extend({  

  template: _.template($('#newsUnitTpl').html()),

  render: function () {  
    this.$el.html(this.template());    
    return this;
  }

});


