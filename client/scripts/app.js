// YOUR CODE HERE:
// https://api.parse.com/1/classes/chatterbox
$(document).ready(function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    // data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      displayMessages(data);
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });  

  var displayMessages = function(data) {
    _.each(data.results, function(message) {
      if (message.username !== undefined) {
        $('.messages').append(messageTemplate(message)); 
      }
    });
  };



});

var cleaner = function(templateVariables) {
  var cleaned = {};
  var removeTags = new RegExp('<[^>]*>', 'g');
  _.each(templateVariables, function(value, key) {
    cleaned[key] = value.replace(removeTags, '');
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
