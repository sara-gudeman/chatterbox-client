// YOUR CODE HERE:
// https://api.parse.com/1/classes/chatterbox
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  friends: [],

  init: function() {
    app.fetch(displayMessages);
  },

  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });   
  },

  fetch: function(callback) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        callback(data);
        console.log('chatterbox: Received messages');
        // console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive messages');
        // console.error('chatterbox: Failed to send message');
      }
    });    
  },

  clearMessages: function() {
    $('#chats').text('');
  },

  addMessage: function(message) {
    $('#chats').append(messageTemplate(message));
  },

  addRoom: function(roomname) {
    $('#roomSelect').append('<span>' + roomname + '</span>');
  },

  addFriend: function(username) {
    app.friends.push(username);
  },

  handleSubmit: function(text, roomname) {
    var message = {
      username: window.location.search.split('=')[1],
      text: text,
      roomname: roomname
    };
    app.send(message);
    //app.addMessage(message);
  }

};

$(document).ready(function() {
  app.init();
  //console.log(window.location.search.split('=')[1]);
  $('#send').on('submit', function() {
    //alert($('#message').val());
    app.handleSubmit($('#message').val(), $('#roomName').val())
  });

  $('#clearChats').on('click', function() {
    app.clearMessages();
  });

  $('#chats').on('click', '.username', function() {
    app.addFriend($(this).text());
  });

  var update = function() {
    app.fetch(displayMessages);
    setTimeout(update, 5000);
  };

  update();
});

var cleaner = function(templateVariables) {
  var cleaned = {};
  var removeTags = new RegExp('<[^>]*>', 'g');
  _.each(templateVariables, function(value, key) {
    if (value !== null) {
      cleaned[key] = value.replace(removeTags, '');
    }
  });
  return cleaned;
};

function displayMessages(data) {
  _.each(data.results, function(message) {
    if (message.username !== undefined) {
      $('#chats').append(messageTemplate(message)); 
    }
  });
};
// Templates
function messageTemplate(variables) {
  cleaned = cleaner(variables);
  return '<ul class="chat">' +
    '<span class="username">' + cleaned.username + '</span>' +
    '<p class="text">' + cleaned.text +'</p>' +
    '<time class="created" datetime="' + cleaned.createdAt + '">' + cleaned.createdAt+ '</time>' +
    '<time class="updated" datetime="' + cleaned.updatedAt + '">' + cleaned.updatedAt + '</time>' +
  '</ul>'
};
