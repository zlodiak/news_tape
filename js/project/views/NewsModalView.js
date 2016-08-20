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

