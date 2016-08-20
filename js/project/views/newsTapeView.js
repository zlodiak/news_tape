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
    var letters = $("#filterTitleField").val();
    var filteredArray = this.collection.search(letters);

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
      // console.log(val.title);
      // console.log(val.description);
      // console.log(val.poster);

      var newsModel = new APP.NewsModel({
        id: key.replace('id', ''),
        title: val.title,
        description: val.description,
        poster: val.poster
      });

      self.collection.add(newsModel);
    });

    // console.log(this.collection);
  }  

});


APP.NewsUnitView = Backbone.View.extend({  

  initialize: function(news) {   
    this.model = news.model;
  },

  className: 'news',

  template: _.template($('#newsUnitTpl').html()),

  render: function () {  
    this.$el.html(this.template({
      title: this.model.get('title'),
      description: this.cutText(this.model.get('description'), 25),
      poster: this.model.get('poster')
    }));   

    return this;
  },

  events: {
    'click': function() {   
      this.openModal();
    }
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


APP.NewsModalView = Backbone.View.extend({  

  initialize: function(model) {   
    this.model = model;
    block = null;
    win = null;   
  },

  template: _.template($('#newsModalTpl').html()),

  render: function () {  
    $('#modalwindow').html(this.template({
      title: this.model.get('title'),
      description: this.model.get('description'),
      poster: this.model.get('poster'),
      likeState: this.getLikeClass()
    }));  

    return this;
  },

  getLikeClass: function() {
    var likeState;

    if(this.model.get('likeState')) {
      likeState = 'active';
    } else {
      likeState = 'unactive';
    };

    return likeState;
  },

  toggleLikeState : function() {  
    var state = this.model.get('likeState') ? false : true;
    this.model.set({likeState: state});
  },

  initOverlayElem: function() {
    var self = this;

    var block = document.getElementById('blockscreen'); 

    if (!block) {
      var parent = document.getElementsByTagName('body')[0],
          obj = parent.firstChild; 

      block = document.createElement('div'); 
      block.id = 'blockscreen'; 
      parent.insertBefore(block, obj);

      block.onclick = function() { self.close() };         
    }

    block.style.display = 'inline';     
  },

  initModalElem: function(width, html) {
    var self = this;

    win = document.getElementById('modalwindow'); 

    if(!win) {
      var parent = document.getElementsByTagName('body')[0];
      var obj = parent.firstChild;

      win = document.createElement('div');
      win.id = 'modalwindow';   
       
      parent.insertBefore(win, obj);
    }

    win.style.width = width + 'px'; 
    win.style.display = 'inline'; 
    
    win.innerHTML = html; 

    win.style.left = '50%'; 
    win.style.top = '5%'; 

    win.style.marginTop = -(win.offsetHeight / 2) + 'px'; 
    win.style.marginLeft = -(width / 2) + 'px';

    this.render();

    document.getElementById('closeBtn').onclick = function() { self.close() }; 
    document.getElementById('likeElem').onclick = function() { 
      self.toggleLikeState(); 
      self.show();
    }; 
  },

  close: function() { 
    document.getElementById('blockscreen').style.display = 'none';
    document.getElementById('modalwindow').style.display = 'none';        
  },

  show: function(html) {
    this.initOverlayElem();
    this.initModalElem(html);
  }

});

