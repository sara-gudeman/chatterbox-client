// YOUR CODE HERE:
// https://api.parse.com/1/classes/chatterbox



var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  friends: [],

  init: function() {
    app.fetch(displayMessages);
    app.fetch(function(messages) {
      var rooms = [];
      messages.results.forEach(function(message) {
        if (rooms.indexOf(clean(message.roomname)) === -1) {
          rooms.push(clean(message.roomname));
          app.addRoom(clean(message.roomname));
        }
      });
    });
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
    $('#chats').prepend(messageTemplate(message));
  },

  addRoom: function(roomname) {
    if (!$('#roomSelect option[value="' + roomname + '"]').val()) {
      $('#roomSelect').append('<option value="' + roomname + '">' + roomname + '</option>');
    }
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
    app.addMessage(message);
    app.addRoom(message.roomname);
  }

};

$(document).ready(function() {
  app.init();
  //console.log(window.location.search.split('=')[1]);
  $('#send').on('submit', function() {
    //alert($('#message').val());
    app.handleSubmit($('#message').val(), $('#roomName').val())
    return false;
  });

  $('#clearChats').on('click', function() {
    app.clearMessages();
  });

  $('#chats').on('click', '.username', function() {
    app.addFriend($(this).text());
  });

  $('#send').on('change', '#roomSelect', function() {
    console.log($('#roomSelect').val());
  })

  var update = function() {
    app.fetch(displayMessages);
    setTimeout(update, 5000);
  };

  update();
});


var clean = function(text) {
  var removeTags = new RegExp('<[^>]*>', 'g');
  if (text !== undefined && text !== '' && text.length < 40) {
    return text.replace(removeTags, '');
  }
};

/*var cleanObj = function(fullMsg) {
  var cleanedMsg = {};
  _.each(fullMsg, function(value, key) {
    cleanedMsg[key] = clean(value);
  });

  return cleanedMsg;
};*/

function displayMessages(data) {
  _.each(data.results, function(message) {
    if (message.username !== undefined) {
      $('#chats').append(messageTemplate(message)); 
    }
  });
};
// Templates
function messageTemplate(msg) {
  return '<ul class="chat">' +
    '<span class="username">' + clean(msg.username) + '</span>' +
    '<p class="text">' + clean(msg.text) +'</p>' +
    '<time class="created" datetime="' + clean(msg.createdAt) + '">' + clean(msg.createdAt)+ '</time>' +
    '<time class="updated" datetime="' + clean(msg.updatedAt) + '">' + clean(msg.updatedAt) + '</time>' +
  '</ul>'
};
