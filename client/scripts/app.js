// YOUR CODE HERE:
/*var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};*/
/*

HELPER FUNCTIONS

*/

var createDiv = function(message, username, callback) {
  var $div = $('<div class="messages"></div>');
  var $username = $('<span class="username">' + username + ': ' + '</span>');
  var msg = escape(message); 
  msg = msg.replace(/%2\d/g, " ");
  var $msg = $('<span class="message"></span>')
  if (!msg.match(/\</) && !msg.match(/\>/)) {
    if (msg.length < 100) {
      $msg.html(msg);        
      $div.prepend($msg);
      $div.prepend($username);
      return $div;
    }
  }
  
  return undefined;

};

/*

GLOBAL APP OBJECT

*/
var app = {};

app.init = function() {
  app.fetch();
};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.send = function(message) {
  var user = window.location.search.substring(1).split('=')[1];
  var input = message;
  var message = {
    username: user,
    text: input,
    roomname: '8th floor'
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
  var $msg = createDiv(message.text, message.username);
  $('#chats').prepend($msg);
};

/*

JQUERY ONREADY

*/

$(document).ready(function() {
  $('button').on('click', function(event) {
    event.preventDefault();
    //creating info
   var msg = $('input[name="chat-msg"]').val();
   
   var message = app.send(msg);

   var user = window.location.search.substring(1).split('=')[1];
   var $msg = createDiv(msg, user);
   //adding to DOM
   $('#chats').prepend($msg);
   //send
   console.log('Trying')
  });

  $('.refresh').on('click', function(event) {

    app.refresh();
  });
})


app.init();


