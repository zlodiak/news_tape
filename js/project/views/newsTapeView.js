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

  events: {
    'click #filterTitleField': function(e) {   
      e.preventDefault()
      console.log('filterTitleField')
    }
  },  

  _createNewsUnits: function () {  
    this.collection.each(function (news) {    
      var newsUnitView = new APP.NewsUnitView({model: news});      
      $(this.$('#newsList')).append(newsUnitView.render().el);
    }, this);
  },

  _fillCollection: function () {  
    var self = this;

    $.each(APP.CONFIG.values, function(key, val) {    
      // console.log(val.title);
      // console.log(val.description);
      // console.log(val.poster);

      var newsModel = new APP.NewsModel({
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

  initialize: function(model) {   
    this.model = model.model;
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

  openModal: function() { console.log('openModal')
    var newsModalView = new APP.NewsModalView(this.model);
    newsModalView.show(555, ['dfsdsdf']);
  }

});


APP.NewsModalView = Backbone.View.extend({  

  initialize: function(model) {   
    var self = this;

    this.model = model;
    _block = null;
    _win = null;    
  },

  template: _.template($('#newsModalTpl').html()),

  render: function () {  
    $('#modalwindow').html(this.template({
      title: this.model.get('title'),
      description: this.model.get('description'),
      poster: this.model.get('poster')
    }));  

    return this;
  },

  initBlock: function() {
    var self = this;

    var _block = document.getElementById('blockscreen'); 

    if (!_block) {
        var parent = document.getElementsByTagName('body')[0],
            obj = parent.firstChild; 

        _block = document.createElement('div'); 
        _block.id = 'blockscreen'; 
        parent.insertBefore(_block, obj);

        _block.onclick = function() { self.close() };         
    }

    _block.style.display = 'inline';     
  },

  initWin: function(width, html) {
    var self = this;

    _win = document.getElementById('modalwindow'); 

    if (!_win) {
        var parent = document.getElementsByTagName('body')[0];
        var obj = parent.firstChild;
        _win = document.createElement('div');
        _win.id = 'modalwindow';
        _win.style.padding = '0 0 5px 0';      
        parent.insertBefore(_win, obj);
    }

    _win.style.width = width + 'px'; 
    _win.style.display = 'inline'; 
    
    _win.innerHTML = html; 

    _win.style.left = '50%'; 
    _win.style.top = '10%'; 

    _win.style.marginTop = -(_win.offsetHeight / 2) + 'px'; 
    _win.style.marginLeft = -(width / 2) + 'px';

    this.render();

    document.getElementById('closeBtn').onclick = function() { self.close() }; 
  },

  close: function() { console.log('close')
    document.getElementById('blockscreen').style.display = 'none';
    document.getElementById('modalwindow').style.display = 'none';        
  },

  show: function(html) {
    this.initBlock();
    this.initWin(html);
  }

});

