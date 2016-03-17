var apiKey = 'a7349f0e26e7f9195d7185360d15029681190afc988f4f93';
var baseUrl = 'http://localhost:3000/api'

function getParameterByName(name, url) {
    url = url.toLowerCase();
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

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
        <div class='col-xs-8'>\
          <div class='name'>" + item.name + "</div>\
          <div class='unit'><em><strong>Estimate: </strong>" + unit + "</em></div>\
        </div>\
        <div class='col-xs-1 quantity'>\
          <input type='number' name='quantity[]' value='1' />\
        </div>\
      </div>\
  ";

  return result;
}

function addListSuccessTmpl() {
  var result = "\
    <div class='alert alert-success' role='alert'>\
      <strong>Well done!</strong> You list is successfully created.\
    </div>\
  ";

  return result;
}

function shopIt(text) {

  $.ajax(baseUrl + '/shoplistry/parse', {
    method: 'post',
    data: {
      raw_text: text
    },

    headers: {
      'X-Spree-Token': apiKey
    },

    beforeSend: function(xhr, settings) {
      $('#status').html(statusText['loading']).fadeIn();
    },

    success: function(data) {
      var items = '';
      for (var key in data.shoplistry) {
        items += itemTmpl(data.shoplistry[key]);
      }
      $('#data').fadeIn('slow').html(items);
      $('#action').fadeIn('slow');
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

function createList() {
  var items = [], $qty, $variant_id;
  var name = $('#list-name').val();

  $('.row.product').each(function(index, el) {
    $variant_id = $(el).find('.variant_id input');
    $qty = $(el).find('.quantity input');

    if ($variant_id.is(':checked') && $qty.val() > 0) {
      items.push({
        variant_id: $variant_id.val(),
        quantity: $qty.val()
      });
    }
  });


  $.ajax(baseUrl + '/shopping_lists', {
    method: 'post',
    contentType: 'application/json',

    headers: {
      'X-Spree-Token': apiKey
    },

    data: JSON.stringify({
        name: name,
        list_type: 'default',
        items: items
    }),

    beforeSend: function(xhr, settings) {
      $('#status').html(statusText['loading']).fadeIn();
    },

    success: function(data) {
      var msg = addListSuccessTmpl();

      $('#data').fadeIn('slow').html(msg);
      $('#action').fadeOut('slow');
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
