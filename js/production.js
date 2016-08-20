APP.NewsModel = Backbone.Model.extend({
  defaults: { 
    id: undefined,
    title: undefined,
    poster: undefined,
    description: undefined,
    likeState: true
  }
});  ;APP.NewsTapeView = Backbone.View.extend({  

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

});;APP.NewsUnitView = Backbone.View.extend({  

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

});;APP.NewsModalView = Backbone.View.extend({  

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

;APP.NewsModelsCollection = Backbone.Collection.extend({
  model: APP.NewsModel,

  search: function(letters) {
    if (letters == "") { return this.models };

    var pattern = new RegExp(letters, "gi");
    var filtered = this.filter(function(model) {
      return model.get('title').indexOf(letters) > -1;
    });

    return filtered;
  } 
});;APP.CONFIG = {
  "headers": {
    "title":{"title":"Заголовок","type":"text"},
    "description":{"title":"Описание","type":"text"},
    "poster":{"title":"Изображение","type":"file"}
  },
  "values":{
    "id1": {"title":"Lorem ipsum dolor sit.", "poster": "images/1.jpg", "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae exercitationem aliquam, ducimus sapiente qui vel laudantium cum quod alias unde hic numquam sequi quia ab veritatis officiis cumque dolore ipsum. Necessitatibus laborum, similique nisi sapiente ad assumenda doloribus libero tempore sit accusantium nemo distinctio modi, voluptatum corrupti, non deserunt cumque. Qui quisquam velit incidunt est omnis nobis veniam laborum ut rem ullam, tempora in error excepturi odit praesentium atque voluptas mollitia tenetur corporis culpa, consequuntur vero. Tempore nisi sed perspiciatis odit quo fuga iure sapiente aut eos obcaecati, iusto, beatae excepturi libero eligendi quidem ab animi vero voluptatum assumenda, numquam nam consequatur dolores? Nesciunt odio eveniet saepe obcaecati explicabo, beatae doloremque dolorem rem. Sunt officiis, voluptatibus debitis facilis sapiente velit aperiam provident alias placeat, blanditiis voluptatum odit earum quos animi, iusto iure dignissimos libero. Eum eos veritatis fugiat, hic ducimus voluptas assumenda nam explicabo praesentium sit quos, accusantium magnam atque doloribus beatae voluptate quam harum commodi sunt aliquid, laborum obcaecati, id eveniet! Quisquam explicabo aperiam exercitationem deserunt expedita reprehenderit! Velit consectetur beatae, modi deleniti assumenda consequatur. Dolorem fugit vel perferendis modi minima quis quas, quo quasi veniam, dolorum fuga. Pariatur assumenda expedita molestias tenetur, quam nostrum nisi praesentium necessitatibus doloribus!"},
    "id2": {"title":"Nobis delectus deleniti, amet.", "poster": "images/2.jpg", "description": "Fuga, porro, nemo. Ut, nisi reiciendis exercitationem error, doloribus ipsum recusandae repudiandae expedita ratione nemo eum cum quis, quos unde maiores autem distinctio optio quo quae. Excepturi facere atque quae amet totam assumenda blanditiis aspernatur recusandae dignissimos nostrum alias officia, veritatis enim consectetur repudiandae ducimus quod a voluptatibus explicabo quasi, molestias beatae deserunt nobis unde. Impedit a nesciunt, suscipit dicta cum doloremque! Itaque dolorem voluptatum dicta. Obcaecati eum a similique quos error nemo quas inventore ipsum, veritatis quibusdam delectus ipsam odit, nam reiciendis. Vitae officia velit dolore sequi laboriosam. Tempore explicabo blanditiis voluptate sequi voluptatum aliquid enim aut dignissimos saepe, ullam eveniet, error a esse voluptatem reprehenderit, labore inventore similique provident autem dolorum aliquam. Ipsum voluptatibus quas culpa consequatur, nobis in corporis eaque dolor, dignissimos repudiandae eius eum saepe rerum, atque cupiditate quam iure delectus? Natus facilis expedita, quod aut consequuntur exercitationem saepe, a reiciendis tenetur repellat nam deserunt ullam vero cum suscipit iure dolorum totam voluptates. Provident deserunt deleniti distinctio placeat voluptate. Facilis veritatis, repellat necessitatibus, quae rem illum, et fuga tenetur perferendis quam alias. Adipisci, officiis, totam. Soluta odio, quos, possimus commodi aspernatur laborum fuga accusamus iure doloribus fugit non porro ullam maiores ducimus, amet hic rerum tempore."},
    "id3": {"title":"Sequi alias, cumque at.", "poster": "images/3.jpg", "description": "Architecto, placeat! Cum perferendis, autem praesentium porro ducimus, eum laboriosam. Eius itaque, blanditiis illo tempore ex, nulla fugiat! Quasi enim eveniet quidem accusantium placeat, vero maiores. Aliquid maiores consequuntur repellendus, cupiditate nulla, quas hic porro molestias culpa, odit ipsum? Commodi architecto illum, iusto distinctio dignissimos est assumenda eveniet tempore. Incidunt est, animi ipsam illum ad asperiores dicta expedita officia perspiciatis tempore molestias itaque nam consequatur labore sapiente nostrum, unde obcaecati laborum dolore officiis error! Ad beatae quaerat vero, reprehenderit nostrum perspiciatis laborum, tempore architecto, adipisci at sequi. Facere nisi aspernatur ut porro, nemo nihil, dolorem magnam tenetur temporibus. Corporis maiores aliquid laboriosam sequi facere praesentium voluptas incidunt officia, deserunt, ipsa tenetur eos quam, voluptatem quibusdam, maxime suscipit temporibus molestiae magni. Dolore voluptatum, a fugit deserunt facilis ad explicabo velit fugiat voluptas culpa officiis aliquam non, minima, molestiae quibusdam, maxime numquam accusantium laudantium. Laboriosam recusandae odio architecto similique praesentium, voluptates autem. Iste, accusantium! Nam cum beatae tempore id natus amet ab, labore expedita. Molestiae soluta ex ipsum hic ut, excepturi. Consequatur vel rerum itaque praesentium rem, saepe qui obcaecati, laudantium accusantium temporibus voluptatum labore consectetur iure fugit eligendi, vero at, aspernatur! Sapiente sit esse ipsa! Doloremque voluptates pariatur non eaque laborum."},
    "id4": {"title":"Odit tempora tempore error.", "poster": "images/4.jpg", "description": "Ducimus velit culpa itaque eum libero praesentium quasi vitae harum quis, sint quod porro facilis a non tempore illum reiciendis. Laboriosam tempora facilis, quod, quibusdam voluptates eum nobis unde adipisci libero molestias temporibus amet doloribus iste consequuntur eius quae vitae voluptatum dolorum totam molestiae placeat cum, sed, suscipit aut quis? Itaque laudantium amet reprehenderit consectetur eum, quidem aliquam adipisci. Quae ratione, id quos eaque quo atque. Libero consequatur tempore esse? Rem nihil nemo fugit ea quibusdam ipsum officia reprehenderit delectus, velit sint quos perferendis blanditiis, porro officiis quas quaerat, error eveniet temporibus odit veniam tenetur similique recusandae! Deleniti consequatur, eaque quam. Molestiae dolor optio dolorum numquam? Commodi iste adipisci voluptatum suscipit officiis necessitatibus odit quam harum aliquam in odio animi corporis, perspiciatis asperiores. Corporis et tempora explicabo tenetur, magnam nostrum pariatur necessitatibus, excepturi quia eligendi. Accusamus, facilis repudiandae dolor labore ab numquam ad voluptas, possimus voluptatibus quos aspernatur. Tempore amet ad fugit eaque doloremque animi, at quis reprehenderit itaque corporis esse maxime vitae ratione asperiores, quod. Quo quam fuga beatae magnam? Exercitationem molestiae debitis, ad, odio ipsum doloribus. Sunt quia numquam architecto veniam placeat, error! Iure hic culpa maiores, cum facere, nam officia eius voluptates magnam quam similique, accusantium consequatur."},
    "id5": {"title":"Recusandae possimus quidem, nesciunt.", "poster": "images/5.jpg", "description": "Debitis nisi, doloribus incidunt aliquam eos repellendus a. Adipisci labore velit necessitatibus libero illo dignissimos obcaecati animi ex architecto, dolore quasi, optio quia odio aut, temporibus quae porro illum consequuntur earum molestiae voluptas, ipsum natus in. Facilis quidem quasi beatae quibusdam aliquam? Tempora ex aut mollitia, blanditiis sapiente, eveniet possimus iusto animi dolore quibusdam impedit voluptas rerum odit. Aperiam voluptatibus similique animi ipsam, fuga dolorum in minima error ex ullam corporis magni nemo, quae nulla maiores libero labore quam alias commodi sit facere voluptatum impedit voluptatem natus. Obcaecati autem ea modi, voluptatem ullam, tempora quod, voluptatibus amet libero doloremque culpa recusandae quae unde deserunt omnis nulla rerum mollitia ad explicabo voluptates molestias ipsam, beatae velit dolor. Fugit veritatis quo inventore, ut, tempore perspiciatis voluptates perferendis adipisci odit quis explicabo dignissimos? Voluptatum iure placeat omnis consequatur praesentium fugit repellat amet minus non? Obcaecati est, doloribus magnam. Similique aperiam sunt optio velit ullam itaque sequi voluptates blanditiis facilis? Inventore eveniet nam ipsa tempore incidunt fugiat reiciendis neque perferendis asperiores natus amet corrupti quisquam, recusandae accusantium dignissimos esse consequuntur quibusdam cupiditate ab quae. Dolorum at dolores possimus obcaecati facere minus, corporis repellendus delectus molestias explicabo commodi debitis, dolore, quos nostrum enim nemo tempore."},
    "id6": {"title":"Placeat enim, facilis molestiae.", "poster": "images/6.jpg", "description": "Consectetur aperiam nam esse earum, repudiandae, molestiae! Fuga impedit ex, repellendus fugiat sapiente quia perspiciatis voluptas suscipit debitis delectus vel tenetur cum officiis beatae numquam excepturi dignissimos, placeat, molestias eos explicabo qui autem illo. Suscipit facilis, sequi veniam mollitia enim ipsam eveniet! Distinctio, recusandae sit beatae quae. Debitis excepturi magnam odit at, perspiciatis repellat quae modi ut quis natus minima libero amet aut minus praesentium enim dolorum iure. Quisquam recusandae, tempore voluptatem nihil pariatur corporis nam ab voluptatibus voluptates soluta quos dolorum, porro, architecto similique libero voluptatum rem dicta ad. Obcaecati fugiat ea perferendis maxime dolor fugit illo quas molestiae voluptate explicabo, hic, magni earum, pariatur excepturi ab recusandae laboriosam eos nisi eum nam sed sit asperiores dolorum. Molestias harum quaerat mollitia placeat suscipit, cupiditate laborum doloremque ad, architecto similique in nulla et dicta, vero maxime praesentium asperiores ut quisquam soluta inventore voluptatum rem. Delectus nisi impedit accusamus placeat repellat. Eius cum sequi, facere officia sint, maiores magnam ipsa quidem odit aut inventore asperiores corporis expedita animi. Mollitia ex suscipit deserunt amet a explicabo iste maiores voluptates, ea vitae est iusto accusamus nisi unde, quas aspernatur nihil, eveniet sapiente sequi corporis dolor, doloribus eius. Nemo debitis, expedita impedit! Illum, assumenda?"},
    "id7": {"title":"Architecto mollitia, dicta ratione?", "poster": "images/7.jpg", "description": "Vel quae minus consequuntur hic culpa dolor, sapiente? Debitis fugiat laboriosam a veniam dolore aperiam necessitatibus. Deserunt, odit commodi hic magnam molestiae, rerum ut, aperiam omnis maiores possimus consequuntur quia non laborum numquam. Eius magni maxime delectus, tempore praesentium ipsum et obcaecati, quidem excepturi atque, laborum consequuntur culpa. Debitis adipisci earum, quae ad quam cupiditate id nam nostrum ducimus in. Tempore, repellat quia assumenda maxime, saepe architecto! Fugiat possimus quia odio quis nulla libero veniam maxime veritatis, optio eaque, incidunt asperiores exercitationem impedit pariatur dolores et rem corporis debitis. Atque exercitationem hic alias beatae non maxime quas nobis tempora in esse, repellendus dolorum aspernatur possimus maiores aliquid, odio repellat dolores, perspiciatis officiis, suscipit quis cum. Nulla distinctio, optio, expedita iure, accusantium nihil ipsam atque aut numquam animi tempora. Similique eligendi est, impedit ut nostrum. Ducimus saepe soluta delectus placeat iusto, mollitia ratione vel accusantium nulla beatae quo. Id, adipisci cumque magni autem libero vel non et corrupti temporibus voluptatibus blanditiis expedita officiis, sunt reprehenderit ducimus repellat quaerat pariatur, eligendi numquam distinctio veritatis ratione assumenda doloribus provident. Voluptatem iste rerum repellendus aperiam id fugiat quia mollitia, porro tempora inventore exercitationem laboriosam delectus repellat odio nostrum. Vel cum quisquam, commodi iure distinctio!"},
    "id8": {"title":"Possimus laudantium eaque, pariatur.", "poster": "images/8.jpg", "description": "Quisquam animi cumque eius aspernatur vero totam reiciendis, aliquid quae dicta, natus porro provident, est, blanditiis expedita! Quaerat error expedita culpa, quod consectetur magni aspernatur accusantium porro voluptatibus! Perferendis voluptatibus sed, eveniet. Explicabo fugit cumque necessitatibus ipsa illum ipsam eaque perferendis eligendi magni doloremque. Facere aliquam aspernatur explicabo quis quas quisquam sit, voluptatibus in cumque, hic voluptates culpa nulla, assumenda nisi nam vitae provident enim unde quos exercitationem ipsa. Numquam cumque nobis pariatur iure, odit nulla asperiores quas expedita consectetur commodi ullam voluptatibus fugit reiciendis facilis culpa a! Quo quis eveniet velit harum odio voluptate earum perspiciatis alias expedita, amet nulla tempore assumenda enim aperiam iusto, modi fugiat delectus aliquam cum sequi consectetur omnis pariatur. Libero reprehenderit molestiae illum, ipsam ipsa quas impedit repellendus reiciendis consequatur. Quo assumenda quaerat suscipit autem, libero blanditiis numquam fugiat cupiditate a voluptate provident atque dolore commodi molestias, consectetur perferendis. Repudiandae iure repellendus odio quos quam eveniet sunt ullam nulla deserunt voluptas quia sapiente aperiam veritatis, ex explicabo, distinctio dolor perspiciatis? Minima vitae saepe voluptas error cupiditate obcaecati consectetur facere fuga, inventore omnis aspernatur voluptatibus voluptatum amet quisquam quam quae ducimus placeat. Corrupti vel excepturi adipisci natus aperiam voluptate quibusdam beatae qui ad, laudantium. Magni!"},
    "id9": {"title":"Maiores, cupiditate nihil quasi!", "poster": "images/9.jpg", "description": "Provident vel ipsa autem officiis quasi eum deserunt voluptates, non accusantium aperiam necessitatibus debitis quis temporibus illum dolore, in. Praesentium ad, doloribus omnis! Voluptatum minus vitae laudantium maiores facere minima iure numquam iste magni nemo, harum consequuntur velit eius neque libero laboriosam quae voluptas sapiente eum corrupti aperiam! Quaerat illum fugiat, unde quibusdam, eius dolorem. Fugit ab, impedit dicta explicabo. Similique quasi sed saepe, molestias beatae laudantium fugit, iusto sapiente ex recusandae facilis qui ad debitis sint temporibus, deleniti! Beatae excepturi exercitationem architecto, atque sit maxime voluptates commodi ex delectus ad nobis ipsum consectetur necessitatibus rerum consequuntur, deserunt quam molestiae eveniet ea ipsam, numquam. Numquam aperiam et officia minima ad totam libero quod, fugit sed placeat saepe illum, animi assumenda natus modi! Nemo voluptatum eum veniam deleniti laboriosam delectus! Necessitatibus similique neque quod, omnis itaque et debitis voluptatem quaerat nobis distinctio blanditiis! Asperiores accusantium, ex, eaque itaque officiis eveniet ab veniam est quod aliquid animi rem aperiam voluptate placeat vel corporis praesentium illo optio tempore quam assumenda eius deserunt quidem doloribus. Dolorem, est. Mollitia maiores, aut assumenda necessitatibus aliquam nisi sit ut sunt, similique, rem quos. Mollitia perspiciatis dolor, quibusdam architecto laudantium porro blanditiis deleniti. Ad tenetur, iusto quam expedita."},
    "id10": {"title":"Neque ipsam, totam odit.", "poster": "images/10.jpg", "description": "Ex nemo ab adipisci iusto modi illum eius molestiae quo sint at ratione consequatur impedit excepturi laudantium deserunt dolore a, soluta nobis quae doloremque? Rem quasi voluptas necessitatibus maiores iure. Vero repellat explicabo quisquam, esse totam laudantium delectus blanditiis, dolorem mollitia soluta ex odit quis ab nihil ipsum, dignissimos at. Totam ratione, quidem eum ea, quaerat ab veniam explicabo adipisci repellat fuga, accusantium facilis earum! Ipsa optio exercitationem, modi ullam laudantium explicabo dignissimos pariatur rem unde nemo beatae eaque, ratione aspernatur quam! Possimus placeat, quidem, voluptates vel dignissimos alias voluptate, dolor delectus molestiae explicabo tempore ratione. Iste nostrum rerum maxime, sunt officiis explicabo, autem laborum nisi aut dolorem illo nam harum esse doloremque accusantium temporibus eum, quam dolor ab. Error libero nobis quasi quos similique amet voluptatibus voluptate cupiditate, quod consequuntur unde corporis possimus eum laboriosam sed, consectetur ducimus numquam molestias enim in. Laudantium natus quis debitis ex ipsam molestiae eos, eveniet itaque ipsa temporibus ad quia sapiente laborum ratione minus tempore delectus, maiores accusamus dolore, sed asperiores reprehenderit exercitationem est aliquam, doloremque. Architecto eos excepturi deleniti delectus hic labore omnis suscipit, quis repellendus est velit ratione, doloribus inventore cumque odit explicabo? Iste quos necessitatibus, dolor perspiciatis dolorum ab similique."},
    "id11": {"title":"Voluptatum perferendis aperiam provident.", "poster": "images/11.jpg", "description": "Eligendi sequi obcaecati cupiditate! Sit error, minima voluptas. Expedita molestiae, dolores odit cum aspernatur necessitatibus nesciunt laboriosam unde obcaecati qui nemo repellendus modi ut veritatis numquam labore, laborum eum doloribus, at esse quaerat animi? Reprehenderit sapiente quod neque atque sed eaque et, dolor dignissimos repudiandae inventore nobis corporis id sit veniam adipisci iste aperiam, nemo perspiciatis odit ullam ipsam. Voluptas aspernatur repudiandae, in aperiam perspiciatis excepturi veniam minima, animi pariatur voluptatum repellat. Quisquam quam ab, vel libero aperiam dicta nemo sint itaque debitis, asperiores atque rerum provident nobis ex corporis distinctio qui. Nesciunt mollitia, quibusdam excepturi temporibus in rerum beatae hic aperiam architecto numquam ipsum asperiores officia dignissimos, nulla alias fuga, accusantium. Illo magnam expedita, cumque doloribus incidunt atque molestiae, fugiat porro eius sunt excepturi neque quam harum blanditiis sint dolor dignissimos natus maxime! Aliquid provident dignissimos, mollitia tempora atque ullam amet officia earum ipsam, quam labore, doloremque laboriosam ex placeat maxime expedita a illo inventore distinctio! Adipisci officia earum eaque neque, repudiandae facilis pariatur quas soluta aperiam harum nesciunt delectus qui ipsa ipsam eum. Blanditiis error ea nesciunt, corporis vel nihil. Vel perferendis adipisci accusantium maiores dolores ipsum. Ea soluta eum aut labore perferendis quas fugiat, ducimus voluptatum tempora."},
    "id12": {"title":"Deleniti architecto assumenda impedit.", "poster": "images/12.jpg", "description": "Nulla unde vitae recusandae eius dignissimos, sed, expedita cum accusantium reiciendis doloremque nisi architecto consequuntur quia, laudantium aliquid impedit tempora tenetur quod aperiam aliquam ex assumenda. Recusandae molestias eos aliquid impedit atque doloremque quas sit alias odio, saepe deserunt molestiae non totam voluptas. Consequuntur fugiat amet minus eveniet excepturi quibusdam, voluptas facere unde quis fugit et voluptatibus voluptate laudantium praesentium voluptatem reiciendis laboriosam eligendi rem beatae reprehenderit ipsa ut sint! Dolorem non velit molestiae aspernatur sit impedit deserunt animi nobis quae adipisci officiis, magnam tempora nemo id eveniet blanditiis laboriosam autem, veniam amet rem repudiandae. Ipsum deleniti asperiores nobis quos. Eveniet, facilis fugit quis quod veritatis. Repudiandae voluptatum ipsum facere quas, minima, dignissimos sed assumenda possimus, veniam ex recusandae animi repellat, saepe unde! Laborum quo, nisi reiciendis quia dolorem doloribus dicta, facilis ea dolores laudantium provident obcaecati ipsum libero explicabo, nemo eos omnis iure mollitia suscipit maxime animi repellendus earum ullam. Dolorem suscipit ipsam vel, nam esse ab! Minus iusto in, unde architecto deserunt quod ut veritatis ipsum, rem inventore culpa quae soluta. Quod unde iure, temporibus maiores quam consequuntur suscipit repudiandae culpa! Debitis accusantium atque incidunt delectus, saepe totam natus dignissimos asperiores consequuntur, aperiam in illo dolores perferendis iste."},
    "id13": {"title":"Soluta eos recusandae natus.", "poster": "images/13.jpg", "description": "Placeat ullam magni nulla officiis minus maiores voluptatem incidunt modi, labore quidem tempora similique quibusdam doloremque expedita asperiores eveniet neque? Laborum nobis iusto sit quod voluptas, doloribus blanditiis voluptatem delectus corporis eum fugiat beatae minus ullam enim culpa, est, excepturi explicabo nostrum suscipit veniam dolor vitae? Magnam error tenetur maiores quasi, dolorum. Aliquid aliquam quibusdam accusantium molestiae atque quod veritatis enim molestias dolorum asperiores fugit, ut ipsam cum, dignissimos optio eligendi distinctio eveniet similique cupiditate reprehenderit. Aperiam provident, maiores, ea, voluptatibus libero voluptates omnis ipsum officiis harum molestiae nemo quas nihil facilis reiciendis, consequatur perspiciatis praesentium autem quia qui suscipit soluta consectetur cumque expedita. Similique rerum quidem quibusdam quo perferendis deserunt tempore, ullam commodi nisi obcaecati architecto error consequuntur natus vitae reprehenderit perspiciatis accusantium quaerat earum, placeat quasi consectetur laborum alias eaque odio reiciendis. Aspernatur impedit nesciunt reiciendis magnam non quasi illo, consequatur quaerat adipisci nobis suscipit sint vitae atque exercitationem dolorum earum doloribus totam alias mollitia voluptas. Reiciendis harum totam in numquam nihil, sapiente iusto voluptatem accusantium magni. Consequuntur incidunt molestiae, impedit eos soluta iste necessitatibus aperiam doloremque, repudiandae eligendi reprehenderit adipisci laboriosam eius. Labore unde expedita facilis nostrum impedit! Qui sed magni odio libero, inventore odit debitis facilis."},
    "id14": {"title":"Laborum repellendus at voluptatem.", "poster": "images/14.jpg", "description": "Distinctio excepturi esse nihil ratione beatae numquam assumenda enim doloremque possimus, rerum, nam voluptatibus magni amet reiciendis architecto adipisci placeat unde vero dolore ea inventore est natus laborum. Nam asperiores debitis, saepe consectetur dolorem odio fugiat amet repellendus cumque ea labore explicabo a atque recusandae in. A qui beatae nisi neque magnam voluptatibus sint tenetur quos eligendi aperiam vitae maiores et quisquam, minima hic recusandae optio laboriosam, autem illo cumque numquam praesentium! Debitis officia a illo aperiam velit amet, dignissimos quae eos sequi ullam perspiciatis eaque ex voluptatem, nihil, itaque obcaecati quaerat nemo veritatis. Officia alias velit eaque similique! Facilis, reiciendis omnis. Possimus, voluptatibus! Nesciunt quasi, harum maiores laboriosam aut beatae illo fugiat, error eaque perferendis, suscipit voluptate. Laudantium a, expedita iusto, cupiditate quibusdam quos consequuntur autem quam vel, officia perspiciatis quae tempora temporibus dolores labore dolore ab fugit! Accusantium beatae maxime esse animi dolor fuga eaque libero saepe cupiditate similique, tempore est repellendus numquam aperiam, impedit, cum unde rem. Numquam vel totam iusto reiciendis amet in consequuntur ab, fugit, sed libero, nobis sint dolorum a omnis id minima. Asperiores eos qui, suscipit nulla! Excepturi libero rerum omnis, ratione sit quia, commodi voluptate, consequuntur voluptatum praesentium, cum eaque quod neque!"},
    "id15": {"title":"Voluptatum officiis tempore, consequuntur!", "poster": "images/15.jpg", "description": "Sunt corporis consequuntur, eos, accusantium reiciendis exercitationem itaque? Cumque eaque sint, praesentium voluptate, maiores, atque delectus maxime fuga alias numquam autem? Praesentium quibusdam corporis tenetur est dolore excepturi, ex eos, sit nihil cum nemo facere quod suscipit vero aliquid. Nemo rem, laudantium porro similique illo magni odio. Nulla officiis modi ad explicabo praesentium iusto. Atque, blanditiis eaque, quaerat sequi labore, assumenda qui molestiae quibusdam doloribus deserunt veniam praesentium magni. Perferendis repellendus sint asperiores corrupti voluptas nostrum, beatae quis voluptatem itaque, officiis amet eligendi ea facilis corporis iure quod repellat harum ex cumque accusantium dolorem. Dolore aperiam, facere culpa ducimus aliquid saepe tempora officia voluptatem alias rem, dolores ipsum. Deleniti corporis quisquam error, voluptas adipisci a quis laudantium tempora maiores sint ullam ad dolorem dicta beatae repellendus iste labore officia, molestias hic molestiae ab eum. Sit numquam ipsam sed adipisci molestias quae reprehenderit explicabo eaque beatae soluta ipsum repellat iure doloremque deserunt tenetur enim nemo, similique nesciunt. Architecto, quas libero rerum veritatis natus doloremque odio! Dolor deserunt libero doloribus iure deleniti quia iste ducimus est distinctio quae omnis, fugit saepe, assumenda explicabo ratione facere perferendis aspernatur natus voluptates consectetur similique magni minus debitis. Voluptatum quibusdam corporis recusandae alias optio dolorem aspernatur."},
    "id16": {"title":"Cupiditate, commodi, eos! Natus.", "poster": "images/16.jpg", "description": "Obcaecati dolorem harum possimus ab numquam, ut aliquam autem enim quia nobis adipisci reiciendis eos, earum magni nulla, aut velit? Voluptate nobis, quibusdam, sunt numquam quia dignissimos cum dolorem sed, facilis sequi fugit. Aliquid sapiente ratione beatae labore doloremque tenetur, facilis nulla architecto? Aspernatur sapiente eius, atque nobis vitae ducimus doloribus sit voluptatum. Commodi amet ducimus pariatur, beatae placeat quis. Ipsa veniam, delectus, eos qui veritatis voluptates, distinctio officiis perferendis cumque labore animi harum tempora impedit assumenda perspiciatis? Necessitatibus enim, sunt voluptate delectus perferendis quo, iusto fugiat molestias saepe aspernatur temporibus aliquam magni vero quasi sapiente voluptatem, doloremque dicta voluptatibus rem! Temporibus unde earum amet iusto ipsam officia, ea dolore, nesciunt dolores voluptatem dolorem explicabo hic ratione ducimus cupiditate tenetur sapiente quas quos repellendus sit corrupti consectetur dolorum, cumque ullam harum. Vel incidunt aspernatur, iste consequatur, vitae tenetur architecto blanditiis, obcaecati repellat non quos, ex quasi explicabo voluptates mollitia ullam commodi modi. Mollitia, cum perferendis adipisci quam iste rem, dignissimos quo, eum tempora nemo itaque minima asperiores alias rerum. Porro asperiores illo atque, reiciendis facere aliquam molestiae nulla maiores ratione laboriosam ex, fugiat nobis, quos explicabo odio repudiandae numquam maxime provident facilis. Consequatur libero repudiandae debitis odit quas! Doloribus, sequi."},
    "id17": {"title":"Provident delectus, esse!", "poster": "images/17.jpg", "description": "Non quia consequatur voluptatum natus, repellendus dolorem alias dolorum aperiam odio incidunt ratione voluptate consequuntur, nihil, ad placeat sit suscipit animi recusandae aliquam maxime quod fuga quos dolor nulla. Inventore molestias quaerat, mollitia libero officiis harum reprehenderit dolore repellendus magnam deleniti ad aliquid odio, laboriosam molestiae iusto, at facilis nesciunt temporibus perferendis. Architecto debitis libero qui ullam ut asperiores, sequi eos ratione impedit facere alias nam voluptatum aspernatur voluptatem quaerat, eligendi delectus eius tempora porro nisi officia. Incidunt quibusdam dolores eos fugit, necessitatibus obcaecati nisi minus omnis distinctio minima? Reiciendis doloribus labore placeat veniam vel ullam, ipsum esse nesciunt tempore optio, ex dolores incidunt. Cupiditate voluptate nihil doloribus facere similique voluptatibus earum sit eligendi iure repudiandae velit veniam, ad possimus suscipit dignissimos neque architecto alias. Odio esse inventore aliquam ex, ullam porro ducimus et nobis consequuntur expedita. Corporis amet consequuntur dignissimos ex placeat quos officia eaque aliquid, officiis maxime assumenda nostrum tenetur repudiandae rerum quaerat voluptate ducimus velit, veniam, nihil harum a facere aspernatur sapiente est. Debitis aspernatur vel, nisi ratione mollitia, cum iusto eum id beatae veritatis ipsa iure. Explicabo, voluptatum veritatis iure velit laborum laudantium aut vero provident aliquid, nulla nobis tenetur illo aperiam fuga nostrum. Eius, perspiciatis."},
    "id18": {"title":"Consequuntur, repudiandae, vel!", "poster": "images/18.jpg", "description": "Accusantium veniam, nesciunt. At fugit molestiae aliquid nesciunt id expedita enim rem tenetur, labore officia dicta quia, ut, vel illo aspernatur doloribus impedit voluptate perferendis repellendus repellat consequatur? Nihil officiis placeat hic harum odit recusandae non corporis ullam magni eaque unde veritatis, mollitia quas perferendis laborum molestiae vel numquam dolorem repudiandae quis ad. Consequuntur velit, ducimus nostrum eius alias sapiente et accusamus ipsum ullam error eligendi sunt recusandae illo officia animi soluta quas harum totam optio reprehenderit quo rerum fuga inventore. Nostrum placeat reiciendis commodi doloribus voluptates harum esse tenetur, error quo quaerat hic exercitationem nesciunt vel similique qui assumenda velit omnis reprehenderit sint vitae, sequi. Optio, voluptatem? Voluptatum recusandae debitis repellat enim rerum officia accusamus, expedita minus ab quibusdam corrupti similique sed pariatur corporis dolor tempora nihil iusto voluptas inventore! Deleniti porro nobis incidunt nemo harum ipsam sed. Est dolorum nulla beatae et, necessitatibus aliquid officia ex, ab iste eligendi illo vero optio, tempore. Deleniti illo asperiores cumque distinctio dignissimos. Necessitatibus, similique, ea. Vero explicabo omnis quisquam dolor modi velit harum, molestias nulla quas ea deleniti accusamus debitis error temporibus repudiandae voluptatem voluptatum tenetur aliquam nesciunt ducimus aperiam fugiat. At aliquid, temporibus. Saepe voluptas corporis quae et quam, at?"},
    "id19": {"title":"In, eligendi, inventore!", "poster": "images/19.jpg", "description": "Beatae voluptate quod velit placeat cumque asperiores expedita nostrum tempora enim eligendi at quidem sint consequatur commodi molestiae, inventore, consequuntur modi nobis sed voluptates doloribus quisquam blanditiis nemo. Aliquid suscipit alias rerum tempore officiis iure esse illum! Commodi debitis ipsam labore ea ipsum velit, impedit laudantium quibusdam maiores numquam quas ut incidunt nam voluptatibus porro libero optio perspiciatis aliquam eos? Itaque iste aperiam eum similique quas aspernatur molestias perspiciatis animi reiciendis, ducimus explicabo facilis exercitationem enim, asperiores dolorem deleniti, nam vitae qui nulla ipsa deserunt eius voluptatem doloremque! At quod, velit ab debitis. Obcaecati placeat, porro eaque officiis voluptates minus illum doloremque soluta quo non minima cupiditate repellendus vel rerum qui ex ipsum officia. Quo, dolorem repellendus illo fuga corrupti laboriosam magni nihil, porro explicabo velit aliquid eos libero eius perferendis eaque maxime voluptas architecto facere maiores illum. Eveniet sint, suscipit, distinctio nihil consequatur, animi delectus eos amet ex dolor possimus dicta odio quasi ad harum veniam at quod enim. Nostrum nobis vitae, qui cupiditate dolor pariatur! Quibusdam quasi doloremque corrupti consequuntur aperiam doloribus necessitatibus magnam cumque velit nesciunt adipisci tenetur quidem dignissimos eveniet hic saepe reiciendis explicabo numquam vero omnis enim, aspernatur optio placeat amet. Tempore aspernatur tempora, incidunt!"},
    "id20": {"title":"Nisi, doloribus, temporibus!", "poster": "images/20.jpg", "description": "Expedita incidunt voluptates quidem amet iste perferendis vitae ea ipsum totam, minima asperiores excepturi ullam molestiae dolorem dolorum doloribus voluptatem, culpa omnis iure praesentium nam cum non aperiam nesciunt! Laudantium eligendi minus odio, veniam repudiandae excepturi reiciendis autem assumenda vel distinctio iure hic nam beatae, velit voluptatem! Minus alias recusandae tempore distinctio vitae, reprehenderit illum, repellendus aliquam provident dolorum cum voluptatibus illo iste quo laboriosam ex sequi a. Alias maxime, adipisci fugit quae omnis quas debitis illo repudiandae totam odit, facilis deleniti recusandae placeat voluptas repellendus ab quis hic odio nam sed dolorum aliquam, laudantium tempora quasi veniam. Consectetur esse distinctio tempore dolores culpa iure repudiandae ipsum veniam repellendus, deserunt sapiente tempora id ipsa alias assumenda numquam vel nemo commodi explicabo debitis doloremque earum aspernatur? Placeat corporis possimus similique, pariatur quam ipsa provident porro incidunt architecto dolor, modi, excepturi? Nisi, explicabo minima unde est blanditiis laudantium ex consectetur, iste suscipit recusandae nostrum ipsam amet voluptatem sint. Consectetur eligendi porro neque eaque! Facilis optio necessitatibus vel non nihil reiciendis nisi molestias quod dignissimos fugit iusto recusandae, quas, ea magnam nesciunt sequi sed itaque, id obcaecati. Natus quidem delectus doloribus repellat, laborum eos, maxime eum laboriosam facere, doloremque sequi vero eius aliquid."},
    "id21": {"title":"Reiciendis, quas, veniam!", "poster": "images/21.jpg", "description": "In enim, iure labore possimus cupiditate quibusdam aliquid incidunt iusto quasi ipsum fugiat, impedit magnam, dolore obcaecati? Quas voluptatibus quos repellendus distinctio cupiditate, doloremque qui ipsum cumque consequatur, est culpa nam eos porro a pariatur. Odit illo, blanditiis voluptatum odio. Quisquam mollitia, assumenda non explicabo amet nam corrupti, soluta dolores maiores, magni quis. Facilis omnis in ipsum sed dignissimos ratione veritatis molestias dolorem laboriosam molestiae, consequuntur repellat. Nostrum minus quos doloribus optio dolorum, ea accusamus est dicta minima qui dignissimos, adipisci consequatur, temporibus. Aperiam, repellendus quia numquam esse. Natus dolorum repellat esse, sint saepe ratione minus eos vitae exercitationem quibusdam sit tempore, iste adipisci ad magni laudantium sed quis nam neque possimus soluta culpa modi facere voluptas! Ducimus saepe eum distinctio quod, libero, ipsam vero, maxime voluptatum laboriosam quia quo repellat repudiandae ullam fugiat eius laborum itaque eaque, et id labore provident vitae repellendus. Fuga, debitis architecto. Tempora atque similique aspernatur facilis neque consequuntur quo dicta est sint sunt enim accusamus saepe delectus mollitia illo dolor maiores, error repellendus ipsum! Aut officiis quasi reprehenderit eius obcaecati perferendis dignissimos sed labore quia vero, quam laboriosam possimus sequi temporibus rem, tenetur aliquam consequatur dicta asperiores facilis laborum. Corporis quasi, magni repellat repellendus."},
    "id22": {"title":"Mollitia, doloremque, reprehenderit!", "poster": "images/22.jpg", "description": "Voluptatem deserunt voluptatibus debitis? Deserunt laboriosam repellendus rem modi ea dolores, aut soluta unde harum incidunt eos sint porro vero ipsa voluptatem culpa suscipit! Neque officiis distinctio minima enim earum, rerum, ipsa, ratione obcaecati voluptatum repellat recusandae cupiditate sint dicta tempore! Cupiditate ratione reprehenderit aperiam quidem, voluptatem voluptates fugiat quia amet est eaque quaerat deleniti vero adipisci, quibusdam, dolorem magnam. Omnis, exercitationem explicabo in id quisquam quia nam suscipit assumenda unde. Deleniti iste pariatur minus accusamus nobis labore totam sint doloribus corporis ut explicabo, fugiat voluptas a odit voluptatem dolores officiis dolorem earum. Distinctio enim dolorum officiis tenetur eligendi quae, quis dolorem modi eaque velit necessitatibus, labore exercitationem in iste sequi mollitia aliquid esse natus consequatur. Error excepturi magni tempora modi illo necessitatibus commodi fugiat quo possimus quidem veniam, iste autem expedita doloribus provident at atque voluptas culpa minima ducimus minus. Sit, culpa, maiores. Praesentium nisi reiciendis voluptas qui aperiam nostrum autem modi accusantium tempore ea fugiat deleniti dignissimos voluptates hic, quas at eum facilis dolorem, inventore earum unde vel aliquid. Temporibus quisquam accusamus cum quo autem. Provident libero, consectetur reprehenderit ducimus atque porro, sunt culpa voluptate cumque repudiandae officiis quod unde molestias incidunt tempora expedita mollitia eligendi, eveniet perspiciatis."},
    "id23": {"title":"Obcaecati, repudiandae, officia.", "poster": "images/23.jpg", "description": "Accusantium assumenda molestiae repellendus omnis sit ea sequi, optio minus aliquid consequuntur dolor ad illum necessitatibus laboriosam eos hic praesentium culpa, molestias consectetur ipsa laudantium facere obcaecati dolorum labore. Fuga, cupiditate soluta totam dicta mollitia accusamus eaque unde corporis aliquid cum velit nam consectetur natus deleniti a molestiae nobis fugit laborum, beatae non autem, ipsum consequuntur eius. Officiis eos nesciunt facere reprehenderit, rerum sunt iste natus veritatis accusantium, perferendis tenetur blanditiis enim doloribus provident velit quam ducimus. Sunt consequuntur itaque provident. At, voluptatum, dolorum! Debitis tenetur error dolore facilis quibusdam magni, deserunt mollitia nesciunt unde quaerat, velit in necessitatibus vitae ea animi cumque, maiores atque voluptates non. Amet, saepe doloribus incidunt reprehenderit illo nesciunt laboriosam id odio sunt iusto recusandae voluptate excepturi est. Aperiam, impedit, consequatur. Placeat, recusandae. Provident voluptas incidunt officia, quia similique doloribus libero vero, quos et amet aperiam velit alias facere id reiciendis. Minus atque tempora, cum quam pariatur rem dicta officia. Consectetur ut aut itaque accusamus? Perferendis blanditiis ipsum rerum voluptas voluptates deserunt nemo amet debitis hic sed nobis, recusandae eveniet facere cupiditate odio temporibus architecto quaerat culpa alias quae veritatis dolorem officiis dolores commodi aliquid. Sunt qui quam numquam quia ipsum illum debitis voluptates accusamus."},
    "id24": {"title":"Delectus, doloribus, dolorem?", "poster": "images/24.jpg", "description": "Officiis saepe dolore sit, nemo placeat voluptatem dolorem nesciunt maiores eos, enim minima sunt consequuntur hic rerum similique minus blanditiis incidunt! Facilis sapiente possimus, officia expedita esse atque rerum nesciunt commodi nemo dolor error at aperiam explicabo ducimus aut consequatur fugiat illum inventore dolores a accusantium vitae sed vel magnam! Ipsam illum delectus officiis id eos minus hic eaque! Nesciunt velit ad assumenda unde eveniet est eligendi ipsa, dolorum totam quo. Impedit dolore fuga placeat sed molestiae quibusdam, cumque est ullam, eaque harum rerum iusto laboriosam doloribus. Cupiditate, cumque. Delectus magnam, rem sequi nobis cupiditate harum assumenda nisi asperiores laborum aperiam temporibus quasi voluptate minus quaerat distinctio fugiat vel culpa eaque, consequuntur repellendus dicta, velit at, perspiciatis laudantium iusto. Cumque sapiente mollitia laudantium. Accusamus consequuntur dolorem harum, nesciunt iure quae animi, aliquam. Odio nostrum beatae veritatis, perspiciatis culpa cum blanditiis cumque aliquam, incidunt itaque corporis. Nam sint laboriosam rerum ipsa, voluptatibus nesciunt. Laboriosam odio vitae ullam illum deleniti quisquam, explicabo. Magnam, voluptas. Asperiores expedita doloremque odit soluta corporis facilis magnam vitae saepe quibusdam eius, quo nisi aspernatur temporibus assumenda suscipit vero id sit sapiente rerum dolores doloribus totam, architecto voluptas dolor, blanditiis. Voluptatum quod natus, praesentium dolorum, facilis nemo in?"}
  }
}