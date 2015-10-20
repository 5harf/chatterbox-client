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
  var $div = $('<div class="message"></div>');
  var $username = $('<span class="username">' + username + ': ' + '</span>');
  var msg = escape(message); 

  if (!msg.match(/%/)) {
    if (msg.length < 140) {
      $div.html(msg);        
      $div.prepend($username);
    }
  }
  
  return $div;

};

/*

APP OBJECT

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
    data: JSON.stringify(input),
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
     var msg;

      _.each(response.results, function(message) {
        $div = $('<div class="message"></div>');
        $username = $('<span class="username">' + message.username+":  " + '</span>');
        msg = escape(message.text);
        if (!msg.match(/%/)) {
          if (msg.length < 140) {
            $div.html(msg);        
            $div.prepend($username);
            $('#chats').append($div);  
          }
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

app.update = function(){
  app.clear();
  app.fetch();
};

app.addMessage = function(message) {
  this.send(message);  

};



$(document).ready(function() {
  $('button').on('click', function(event) {
    event.preventDefault();
   var message = $('input[name="chat-msg"]').val();
   $('#chat').prepend()
  });
})



app.init();


