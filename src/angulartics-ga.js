/**
 * @license Angulartics v0.15.20
 * (c) 2013 Luis Farzati http://luisfarzati.github.io/angulartics
 * Universal Analytics update contributed by http://github.com/willmcclellan
 * License: MIT
 */
(function(angular) {
'use strict';

/**
 * @ngdoc overview
 * @name angulartics.google.analytics
 * Enables analytics support for Google Analytics (http://google.com/analytics)
 */
angular.module('angulartics.google.analytics', ['angulartics'])
.config(['$analyticsProvider', function ($analyticsProvider) {

  // GA already supports buffered invocations so we don't need
  // to wrap these inside angulartics.waitForVendorApi

  $analyticsProvider.settings.trackRelativePath = true;

  $analyticsProvider.registerPageTrack(function (path) {
    if (window._gaq) _gaq.push(['_trackPageview', path]);
    if (window.ga) ga('send', 'pageview', path);
  });

  /**
   * Track Event in GA
   * @name eventTrack
   *
   * @param {string} action Required 'action' (string) associated with the event
   * @param {object} properties Comprised of the mandatory field 'category' (string) and optional  fields 'label' (string), 'value' (integer) and 'noninteraction' (boolean)
   *
   * @link https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#SettingUpEventTracking
   *
   * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/events
   */
  $analyticsProvider.registerEventTrack(function (action, properties) {
    // GA requires that eventValue be an integer, see:
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventValue
    // https://github.com/luisfarzati/angulartics/issues/81
    var objToSend = {};

    if(properties.value) {
      var parsed = parseInt(properties.value, 10);
      properties.value = isNaN(parsed) ? 0 : parsed;
    }

    if (window.ga) {
      if (properties.category) {
        objToSend.eventCategory = properties.category;
      }

      if (action) {
        objToSend.eventAction = action;
      }

      if (properties.label) {
        objToSend.eventLabel = properties.label;
      }

      if (properties.value) {
        objToSend.eventValue = properties.value;
      }

      if (properties.hitCallback) {
        objToSend.hitCallback = properties.hitCallback;
      }

      if (properties.noninteraction) {
        objToSend.nonInteraction = 1;
      }

      // TODO: main repo is about to merge this, when the do,
      // we will kill our fork

      // add custom dimensions and metrics
      for(var idx = 1; idx<=20;idx++) {
        if(properties['dimension' +idx.toString()]) {
          eventOptions['dimension' +idx.toString()] = properties['dimension' +idx.toString()];
        }
        if(properties['metric' +idx.toString()]) {
          eventOptions['metric' +idx.toString()] = properties['metric' +idx.toString()];
        }
      }

      ga('send', 'event', objToSend);
    } else if (window._gaq) {
      _gaq.push(['_trackEvent', properties.category, action, properties.label, properties.value, properties.noninteraction]);
    }
  });

}]);
})(angular);
