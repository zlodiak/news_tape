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
    this.collection.each(function (news) {    
      var newsUnitView = new APP.NewsUnitView(news);      
      $(this.el).append(newsUnitView.render().el);
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

  initialize: function(model) {   
    this.model = model;
  },

  template: _.template($('#newsUnitTpl').html()),

  render: function () {  
    this.$el.html(this.template({
      title: this.model.get('title'),
      description: this.model.get('description'),
      poster: this.model.get('poster')
    }));    
    return this;
  }

});


