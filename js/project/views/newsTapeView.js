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
      var newsUnitView = new APP.NewsUnitView({model: news});      
      $(this.el).append(newsUnitView.render().el);
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

  template: _.template($('#newsUnitTpl').html()),

  render: function () {  
    this.$el.html(this.template({
      title: this.model.get('title'),
      description: this.model.get('description'),
      poster: this.model.get('poster')
    }));    
    return this;
  },

  events:{
    'click .news': 'openModal'
  },  

  openModal: function() {
    console.log('mod');

    var newsModalView = new APP.NewsModalView(this.model);
    //$('body').append(newsModalView.render().el);
    newsModalView.show(555, ['dfsdsdf']);
  }

});


APP.NewsModalView = Backbone.View.extend({  

  initialize: function(model) {   
    this.model = model;
    _block = null;
    _win = null;    
  },

  template: _.template($('#newsModalTpl').html()),

  render: function () {  
    this.$el.html(this.template({
      title: this.model.get('title'),
      description: this.model.get('description'),
      poster: this.model.get('poster')
    }));    
    return this;
  },

      initBlock: function() {
              _block = document.getElementById('blockscreen'); //Получаем наш блокирующий фон по ID

              //Если он не определен, то создадим его
              if (!_block) {
                  var parent = document.getElementsByTagName('body')[0]; //Получим первый элемент тега body
                  var obj = parent.firstChild; //Для того, чтобы вставить наш блокирующий фон в самое начало тега body
                  _block = document.createElement('div'); //Создаем элемент div
                  _block.id = 'blockscreen'; //Присваиваем ему наш ID
                  parent.insertBefore(_block, obj); //Вставляем в начало
                  _block.onclick = function() { this.close(); } //Добавим обработчик события по нажатию на блокирующий экран - закрыть модальное окно.
              }
              _block.style.display = 'inline'; //Установим CSS-свойство        
          },

       initWin: function(width, html) {
              _win = document.getElementById('modalwindow'); //Получаем наше диалоговое окно по ID
              //Если оно не определено, то также создадим его по аналогии
              if (!_win) {
                  var parent = document.getElementsByTagName('body')[0];
                  var obj = parent.firstChild;
                  _win = document.createElement('div');
                  _win.id = 'modalwindow';
                  _win.style.padding = '0 0 5px 0';
                  parent.insertBefore(_win, obj);
              }
              _win.style.width = width + 'px'; //Установим ширину окна
              _win.style.display = 'inline'; //Зададим CSS-свойство
              
              _win.innerHTML = html; //Добавим нужный HTML-текст в наше диалоговое окно
              
              //Установим позицию по центру экрана

              _win.style.left = '50%'; //Позиция по горизонтали
              _win.style.top = '50%'; //Позиция по вертикали

              //Выравнивание по центру путем задания отрицательных отступов
              _win.style.marginTop = -(_win.offsetHeight / 2) + 'px'; 
              _win.style.marginLeft = -(width / 2) + 'px';
          },

       close: function() {
              document.getElementById('blockscreen').style.display = 'none';
              document.getElementById('modalwindow').style.display = 'none';        
          },

       show: function(html) {
              this.initBlock();
              this.initWin(html);
          }

});

