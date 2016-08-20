APP.NewsModel = Backbone.Model.extend({

  defaults: { 
    id: undefined,
    title: undefined,
    poster: undefined,
    description: undefined,
    likeState: true
  },

  localStorage: new Backbone.LocalStorage('newsTapeList') 
  
});  