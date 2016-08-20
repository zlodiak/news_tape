APP.NewsTapeView = Backbone.View.extend({  

  initialize: function() {   
    this.collection = new APP.NewsModelsCollection();  
    this.fillCollection();
    this.filteredCollection = new APP.NewsModelsCollection(this.collection.toJSON());
        
    this.render();
  },    

  template: _.template($('#newsTapeTpl').html()),

  render: function () {  
    this.$el.html(this.template());    
    this.createNewsUnits();

    return this;
  },

  events: {
    'keyup #filterTitleField': 'search'
  },  

  search: function(e){  
    var letters = $("#filterTitleField").val(), 
        filteredArray = this.collection.search(letters);

    this.filteredCollection.reset(filteredArray);
    this.createNewsUnits();
  },    

  createNewsUnits: function () {  
    this.$('#newsList').html('');

    this.filteredCollection.each(function(news) {
      var newsUnitView = new APP.NewsUnitView({model: news});
      $('#newsList').append(newsUnitView.render().el);
    }, this);    
  },

  fillCollection: function () {  
    var self = this;

    $.each(APP.CONFIG.values, function(key, val) {    
      var newsModel = new APP.NewsModel({
        id: parseInt(key.replace('id', '')),
        title: val.title,
        description: val.description,
        poster: val.poster
      });

      self.collection.add(newsModel);
    });
  }  

});