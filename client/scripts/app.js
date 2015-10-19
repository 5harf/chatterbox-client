// YOUR CODE HERE:
/*var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};*/
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

      _.each(response.results, function(message) {
        $div = $('<div></div>');
        $username = $('<span class="username">' + message.username+":  " + '</span>');
        $div.html(message.text);
        $div.prepend($username);
        $('#chats').append($div);  
      });

     },
    error: function(error, errorType, errorMessage) {
      console.log('chatterbox: Failed to fetch messages')
     }
    });

};

app.clear = function() {

};
