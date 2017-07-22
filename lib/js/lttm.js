(function() {
  var atwhoOptions, previewUrl;
  var flickr_api_key = '';
  var flickr_url     = 'https://api.flickr.com/services/rest/';

  function get_params(name, page_num) {
    return {
      method: 'flickr.photos.search',
      api_key: flickr_api_key,
      text: name,
      per_page: 15,
      format: 'json',
      nojsoncallback: 1,
      page: page_num
    }
  }

  function flickr_image_url(json, is_thumb = false) {
    base = 'http://farm' + json.farm + '.staticflickr.com/' + json.server + '/' + json.id + '_' + json.secret;
    ext  = (is_thumb) ? '_m.jpg' : '_c.jpg';
    return base + ext;
  }

  function flickr_images(flickrs, callback) {
    var num      = Math.floor(Math.random() * flickrs.length);
    var flickr   = flickrs[num];
    var max      = flickr.max_page || 10;
    var page_num = Math.floor(Math.random() * max + 1);
    $.ajax({
      type: 'GET',
      url: flickr_url,
      data: get_params(flickr.name, page_num)
    }).done(function(data){
      var images;
      images = [];
      $.each(data.photos.photo, function(k, v) {
        url  = flickr_image_url(v);
        thum = flickr_image_url(v, true);
        return images.push({
          name: url,
          imageUrl: url,
          imagePreviewUrl: previewUrl(thum),
          alt: 'LGTM'
        });
      });
      return callback(images);
    });
  }

  atwhoOptions = {
    at: "!",
    tpl: '<li class="lttm" data-value="![${alt}](${imageUrl})"><img src="${imagePreviewUrl}" /></li>',
    limit: 80,
    display_timeout: 1000,
    search_key: null,
    callbacks: {
      matcher: function(flag, subtext) {
        var match, regexp;
        regexp = new XRegExp("(\\s+|^)" + flag + "([\\p{L}_-]+)$", "gi");
        match = regexp.exec(subtext);
        if (!(match && match.length >= 2)) {
          return null;
        }
        return match[2];
      },
      remote_filter: function(query, callback) {
        var kind, task1, task2, task3, url;
        if (!query) {
          return;
        }
        kind = query[0].toLowerCase();
        query = query.slice(1);
        function logResult(json){
          console.log(json);
        }

        switch (false) {
          case kind !== "f":
            return $.getJSON(chrome.extension.getURL("/config/flickr.json"), function(flickrs) {
              flickr_images(flickrs, callback);
            });
        }
      }
    }
  };

  previewUrl = function(url) {
    var hmac, shaObj;
    if (location.protocol === "http:") {
      return url;
    }
    if (url.indexOf('https:') === 0) {
      return url;
    }
    shaObj = new jsSHA("SHA-1", 'TEXT');
    shaObj.setHMACKey('lttmlttm', 'TEXT');
    shaObj.update(url);
    hmac = shaObj.getHMAC('HEX');
    return "https://lttmcamo.herokuapp.com/" + hmac + "?url=" + url;
  };

  $(document).on('focusin', function(ev) {
    var $this;
    $this = $(ev.target);
    if (!$this.is('textarea')) {
      return;
    }
    return $this.atwho(atwhoOptions);
  });

  $(document).on('keyup.atwhoInner', function(ev) {
    return setTimeout(function() {
      var $currentItem, $parent, offset;
      $currentItem = $('.atwho-view .cur');
      if ($currentItem.length === 0) {
        return;
      }
      $parent = $($currentItem.parents('.atwho-view')[0]);
      offset = Math.floor($currentItem.offset().top - $parent.offset().top) - 1;
      if ((offset < 0) || (offset > 250)) {
        return setTimeout(function() {
          var row;
          offset = Math.floor($currentItem.offset().top - $parent.offset().top) - 1;
          row = Math.floor(offset / 150);
          return $parent.scrollTop($parent.scrollTop() + row * 150 - 75);
        }, 100);
      }
    });
  });

}).call(this);
