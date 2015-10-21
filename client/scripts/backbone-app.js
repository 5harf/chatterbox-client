//Message Model
  //set username to username
var app = {};

app.init = function(){
  var messages = new app.Messages();
  messages.fetch();
  var messagesView = new app.MessagesView({ collection : messages });

  $('#main').append(messagesView.render());
};

app.Message = Backbone.Model.extend({
  //set text to Message
  initialize: function(message) {
    this.set('text', message);
  }

});

app.MessageView = Backbone.View.extend({
  initialize: function(){
    //listens to change in model
    this.model.on('change:text', this.render, this);
  },
  //render new message to chatbox
  render: function() {
  //creates message html element
    var html = [
      '<div>',
        this.model.get("text"),
      '</div>'
    ].join('');    
  
    return this.$el.html(html);
  }
})

//create MessagesCollection
app.Messages = Backbone.Collection.extend({
  //sets everything to be an instance of Message Model
  model: app.Message,
  //url of API
  url: 'https://api.parse.com/1/classes/chatterbox',
  //parses API data set
  parse: function(data) {
    return data.results;
    console.log(data.results);
  }
});

app.MessagesView = Backbone.View.extend({
//CollectionView
//initialize
//on change:text, this.render
  initialize: function() {
    this.collection.on('change:text', this.render, this);
  },

  render: function() {
    var html = [
      '<div id="chats">',
      '</div>'
    ].join('');
  
    this.$el.html(html);
    //for each on collection
    debugger;
    this.$el.find('#chats').append(this.collection.map(function(message) {
      //create MessageView
      var messageView = new app.MessageView({model: message});
      //call messageView 
      return messageView.render()
    }));
    //return this.$el
      return this.$el;
    }

});

