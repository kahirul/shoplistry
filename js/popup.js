$(document).ready(function() {
  var text = getParameterByName('text', window.location.href);
  if (text && text.length > 0) {
    shopIt(text);
  }

  $('body').on('click', '#add-to-list', createList);
});

