// YOUR CODE HERE:

/*============================

      HELPER FUNCTIONS

=============================*/

var createDiv = function(message, username, callback) {
  var $div = $('<div class="messages"></div>');
  var $username = $('<span class="username">' + username + ': ' + '</span>');
  var msg = escape(message); 
  msg = msg.replace(/%2\d/g, " ");
  var $msg = $('<span class="message"></span>')
  if (!msg.match(/\</) && !msg.match(/\>/)) {
    if (msg.length < 140) {
      $msg.html(msg);        
      $div.prepend($msg);
      $div.prepend($username);
      return $div;
    }
  }
  
  return undefined;

};

/*========================

     GLOBAL APP OBJECT

=========================*/

var app = {};

app.init = function() {
  app.fetch();
};

app.userInfo = {
  username : null,
  roomname : 'hackerjack'

};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.send = function(message) {
  this.userInfo.username = $('input[name="chat-user"]').val() || 'anonymous';
  var input = message;
  var message = {
    username: this.userInfo.username,
    text: input,
    roomname: this.userInfo.roomname
  };

  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent!');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });

};

app.fetch = function() {
  $.ajax({ 
    url: this.server, 
    type: 'GET',
    success: function(response){

     var $div;
     
      _.each(response.results, function(message) {

        $div = createDiv(message.text, message.username);
        
        if ($div){
          $('#chats').append(createDiv(message.text, message.username));
        }

      });

     },
    error: function(error, errorType, errorMessage) {
      console.log('chatterbox: Failed to fetch messages')
     }
    });

};

app.clearMessages = function() {
  //clears elements from DOM
   $('#chats').empty();
};

app.escape = function (s) {
  return s.split('#').map(function(v) {
      // Only 20% of slashes are end tags; save 1.2% of total
      // bytes by only escaping those.
      var json = JSON.stringify(v).replace(/<\//g, '<\\/');

      return '<script>console.log('+json+')</script>';
      }).join('');
};

app.refresh = function(){
  app.clearMessages();
  app.fetch();
};

app.addMessage = function(message) {
  this.send(message);  
  var $msg = createDiv(message, app.userInfo.username);
  $('#chats').prepend($msg);
};

/*==========================

     JQUERY ONREADY

=========================*/

$(document).ready(function() {
  $('button').on('click', function(event) {
    event.preventDefault();
    //creating info
   var msg = $('input[name="chat-msg"]').val();
   //adds message
   app.addMessage(msg);
   $('input[name="chat-msg"]').val('');
  });

  $('.refresh').on('click', function(event) {

    app.refresh();
  });

  $('select').on('change', function(event) {
     var selected = $('option:selected').val();
     console.log(selected);
      if (selected === 'createRoom'){
        $('input[name="newRoom"]').removeClass('hidden');
          app.userInfo.roomname = selected
      }else {
        $('input[name="newRoom"]').addClass('hidden');
          console.log(selected)
          app.userInfo.roomname = selected;
      };
  });
});


app.init();


