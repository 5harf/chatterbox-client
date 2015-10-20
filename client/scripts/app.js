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

var addRoom = function(roomname) {
 //escape later pls
  if ((!app.rooms[roomname]) && roomname && (roomname.length <= 30)) {
    app.rooms[roomname] = roomname;
    var $option = $('<option value=' + roomname + '></option>')
    $option.html(roomname);
    $('select[name="chat-rooms"]').prepend($option);
  }
}


/*========================

     GLOBAL APP OBJECT

=========================*/

var app = {};

app.init = function() {
  app.fetch();
};

app.rooms = {
  lobby: "lobby"
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
      console.error('chatterbox: Failed to send message!');
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
      //filters only objects that have messages && usernames    
        if (message.text && message.username){
         //if roomname is default/global or matches current room
          if (app.userInfo.roomname === "hackerjack" || app.userInfo.roomname === message.roomname) {
          
            $div = createDiv(message.text, message.username);
          
          //if div is valid, populate  
            if ($div){
              $('#chats').append(createDiv(message.text, message.username));
            }
            
          //populates dropdown list with existing rooms  
            addRoom(message.roomname);
          
          }
        
        }

      });

     },
    error: function(error, errorType, errorMessage) {
      console.log('chatterbox: Failed to fetch messages!')
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

      if (selected === 'createRoom'){
        $('input[name="newRoom"]').removeClass('hidden');
          app.userInfo.roomname = selected
      }else {
        $('input[name="newRoom"]').addClass('hidden');
          app.userInfo.roomname = selected;
      };
      app.refresh()
  });

//checks for created rooms
  $('input[name="newRoom"]').on('keypress', function(event){
    if (event.which === 13){
      event.preventDefault();
      
      //get roomname and add room
      var room = $(this).val();

      //assigns currentroom
      app.userInfo.roomname = room;

      //adds to list of available rooms
      addRoom(room);
      
      //removes field    
      $(this).val('');
      $(this).addClass('hidden');

      //automatically selects new room
      $('option[value="createRoom"]').removeAttr('selected');
    }
  }); 
});



app.init();


