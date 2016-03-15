var statusText = {
  'loading': 'Loading...',
  'success': 'Done!',
  'error': 'Something is not working'
};

function itemTmpl(item) {
  var unit = item.display_price + "/" + item.display_unit;
  var result = "\
      <div class='row product'>\
        <div class='col-xs-1 variant_id'>\
          <input type='checkbox' checked name='variant_id[]' value='" + item.id + "' />\
        </div>\
        <div class='col-xs-2'>\
          <img class='img-rounded' src='" + item.image_url + "' />\
        </div>\
        <div class='col-xs-7'>\
          <div class='name'>" + item.name + "</div>\
          <div class='unit'>" + unit + "</div>\
        </div>\
        <div class='col-xs-1 quantity'>\
          <input type='number' name='quantity[]' value='1' />\
        </div>\
      </div>\
  ";

  return result;
}

var apiKey = 'ac427a658ec6ce3af94d135dafc3730da152aa7ac9964814';

function shopIt(errorCallback) {

  $.ajax('http://localhost:3000/api/shoplistry/parse', {
    method: 'post',
    beforeSend: function(xhr, settings) {
      $('#status').html(statusText['loading']).fadeIn();
    },
    success: function(data) {
      var items = '';
      for (var key in data.shoplistry) {
        items += itemTmpl(data.shoplistry[key]);
      }
      $('#data').fadeIn('slow').html(items);
      $('#action, #hr').fadeIn('slow');
    },
    complete: function(xhr, status) {
      var textStatus = statusText[status];
      if (!textStatus) {
        textStatus = '';
      }
      textStatus = typeof chrome.contextMenus;
      $('#status').fadeOut().html(textStatus);
    }
  });
}

$(document).ready(function() {
  chrome.contextMenus.create({
    "title": "Find it at HappyFresh",
    "contexts": ["all"],
    "onclick" : function(e, a) {}
  });

  shopIt();
});
