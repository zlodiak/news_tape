APP.NewsTapeView = Backbone.View.extend({  

  initialize: function() {   
    var self = this;

    this.collection = new APP.NewsModelsCollection();  


    $.each(APP.CONFIG.values, function(key, val) {    
/*      console.log(val.title);
      console.log(val.description);
      console.log(val.poster);*/

      var newsModel = new APP.NewsModel({
        title: val.title,
        description: val.description,
        poster: val.poster
      });

      self.collection.add(newsModel);

      new APP.NewsUnitView({model: newsModel});
    });

    console.log(this.collection);




        
    this.render();
  },    

  template: _.template($('#newsTapeTpl').html()),

  render: function () {  
    this.$el.html(this.template());    
    $('#newsTapeBox').append(this.template);

/*    _.each(this.model.models, function (wine) {
        $(this.el).append(new WineListItemView({model:wine}).render().el);
    }, this);  */  

    return this;
  }

});



APP.NewsUnitView = Backbone.View.extend({  

  initialize: function(model) {   
    //this.model = new APP.NewsModel();     

    this.render();
  },    

  template: _.template($('#newsUnitTpl').html()),

  render: function () {  
    this.$el.html(this.template());    
    this.$el.append(this.template);

    return this;
  }

});


