(function() {
  var app = angular.module('Twitch', []);

  app.controller("TabController", function() {
    this.tab = 1;
    this.selectTab = function(setTab) {
      this.tab = setTab;
    }
    this.isSelected = function(checkTab) {
      return this.tab === checkTab;
    }
  });

  app.controller('TwitchController', ['$http', function($http) {
    var streamers = ["riotgames", "krzjn", "StreamerHouse", "medrybw", "lirik", "flosd", "sodapoppin", "summit1g", "freecodecamp"];
    var stream = this;
    var callback = "?callback=JSON_CALLBACK";
    var logolink = 'https://placehold.it/64x64';

    stream.all = [];
    stream.online = [];
    stream.offline = [];

    streamers.forEach(function(streamer) {
      $http.jsonp("https://api.twitch.tv/kraken/streams/" + streamer + callback).success(function(data) {

        // Is streamer online? 
        if (data.stream) {
          data.stream.channel.status = data.stream.channel.status.substring(0, 40) + "...";
          data.display_name = data.stream.channel.display_name;
          // Does streamer have a logo?
          if (!data.logo) {
            data.logo = data.stream.channel.logo;
          } else {
            data.logo = logolink;
          }

          data.status = data.stream.channel.status;
          data.url = data.stream.channel.url;
          data.img = "images/greencheck.png";

          stream.online.push(data);
          stream.all.push(data);
        } else {
          $http.jsonp("https://api.twitch.tv/kraken/users/" + streamer + callback).success(function(data) {
            if (data.logo) {
              data.logo = data.logo;
            } else {
              data.logo = logolink;
            }
            data.url = "http://www.twitch.tv/" + streamer;
            data.img = "images/redx.png";
            stream.offline.push(data);
            stream.all.push(data);
          })
        }
      })
    });
  }])
})();