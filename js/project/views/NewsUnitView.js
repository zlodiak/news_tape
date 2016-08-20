APP.NewsUnitView = Backbone.View.extend({  

  initialize: function(news) {   
    this.model = news.model;
  },

  className: 'news',

  template: _.template($('#newsUnitTpl').html()),

  render: function () {  
    var cutLettersCnt = 25;

    this.$el.html(this.template({
      title: this.model.get('title'),
      description: this.cutText(this.model.get('description'), cutLettersCnt),
      poster: this.model.get('poster')
    }));   

    return this;
  },

  events: {
    'click': 'openModal'
  },

  cutText: function(text, symbolsCnt) {
    var cutText = text.substring(0, symbolsCnt);    
    cutText += '...';

    return cutText;
  },

  openModal: function() { 
    var newsModalView = new APP.NewsModalView(this.model),
        widthWindow = window.innerWidth,
        widthModal,
        maxWidth = 500,
        paddingsWidth = 40,
        maxWidthMobile = 768;

    if(widthWindow > maxWidthMobile) {
      widthModal = maxWidth;
    } else {
      widthModal = widthWindow - paddingsWidth;
    };
      
    newsModalView.show(widthModal);
  }

});