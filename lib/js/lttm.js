(function() {
  var atwhoOptions, previewUrl;
  var flickr_api_key      = '';
  var flickr_url          = 'https://api.flickr.com/services/rest/';
  var tumblr_cunsumer_key = '';
  var tumblr_url          = 'https://api.tumblr.com/v2/tagged';

  function get_flickr_params(name, page_num) {
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

  function get_tumblr_params(name) {
    return {
      api_key: tumblr_cunsumer_key,
      tag: name
    }
  }

  function flickr_image_url(json, is_thumb = false) {
    base = 'http://farm' + json.farm + '.staticflickr.com/' + json.server + '/' + json.id + '_' + json.secret;
    ext  = (is_thumb) ? '_m.jpg' : '_c.jpg';
    return base + ext;
  }

  function select_idol(flickrs) {
    var num = Math.floor(Math.random() * flickrs.length);
    return flickrs[num];
  }

  function select_page_num(flickr) {
    var page_num;
    $.ajaxSetup({async: false});
    $.ajax({
      type: 'GET',
      url: flickr_url,
      data: get_flickr_params(flickr.name, 1),
      context: page_num
    }).done(function(data){
      var max = data.photos.pages || 1;
      page_num = Math.floor(Math.random() * max + 1);
    });
    $.ajaxSetup({async: true});
    return page_num;
  }

  function flickr_images(idol, page_num, callback) {
    $.ajaxSetup({async: false});
    $.ajax({
      type: 'GET',
      url: flickr_url,
      data: get_flickr_params(idol.name, page_num)
    }).done(function(data){
      var images;
      images = [];
      $.each(data.photos.photo, function(k, v) {
        url  = 'http://hisaichilgtm.herokuapp.com/' + flickr_image_url(v);
        thum = flickr_image_url(v, true);
        return images.push({
          name: url,
          imageUrl: url,
          imagePreviewUrl: previewUrl(thum),
          alt: 'LGTM:' + idol.name
        });
      });
      return callback(images);
    });
  }

  function tumblr_images(idol, callback) {
    $.ajaxSetup({async: false});
    $.ajax({
      type: 'GET',
      url: tumblr_url,
      data: get_tumblr_params(idol.name)
    }).done(function(data){
      var images = [];
      $.each(data.response, function(k, v) {
        var photos = v.photos;
        if (photos) {
          var photo    = photos[0];
          var thum     = photo.alt_sizes[photo.alt_sizes.length - 2].url;
          var original = photo.original_size.url;

          if (original.indexOf('https') != -1) {
            original = original.replace('https', 'http');
          }

          var url  = 'http://hisaichilgtm.herokuapp.com/' + original;
          return images.push({
            name: url,
            imageUrl: url,
            imagePreviewUrl: previewUrl(thum),
            alt: 'LGTM:' + idol.name
          });
        }
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
          case kind !== 'f':
            return $.getJSON(chrome.extension.getURL('/config/idol.json'), function(idols) {
              var idol = select_idol(idols);
              var page_num = select_page_num(idol);
              flickr_images(idol, page_num, callback);
            });
            break;
          case kind !== 't':
            return $.getJSON(chrome.extension.getURL('/config/idol.json'), function(idols) {
              var idol = select_idol(idols);
              tumblr_images(idol, callback);
            });
            break;
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
