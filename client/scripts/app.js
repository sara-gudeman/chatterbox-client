// YOUR CODE HERE:
// https://api.parse.com/1/classes/chatterbox
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function() {
    app.fetch();
  },
  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        callback(data);
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });   
  },
  fetch: function() {

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        callback(data);
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });    
  },
  clearMessages: function() {
    $('#chats').text('');
  }
};

$(document).ready(function() {
  var getMessages = function(callback) {
  };

  $('input[type="submit"').on('click', function() {
    var message = {
      username: $('input[name="username"]').val(),
      text: $('textarea[name="text"]').val(),
      roomname: $('input[name="roomname"]').val()
    };
    app.send(message);
  });

  var displayMessages = function(data) {
    _.each(data.results, function(message) {
      if (message.username !== undefined) {
        $('#chats').append(messageTemplate(message)); 
      }
    });
  };

  var update = function() {
    getMessages(displayMessages);
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

// Templates
var messageTemplate = function(variables) {
  cleaned = cleaner(variables);
  return '<div class="chat">' +
    '<span class="username">' + cleaned.username + '</span>' +
    '<p class="text">' + cleaned.text +'</p>' +
    '<time class="created" datetime="' + cleaned.createdAt + '">' + cleaned.createdAt+ '</time>' +
    '<time class="updated" datetime="' + cleaned.updatedAt + '">' + cleaned.updatedAt + '</time>' +
  '</div>'
};
