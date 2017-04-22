import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';
import { LiveNewsCollection } from '/imports/api/database.js';

/**
  TODO: Change to runing
*/


import './liveticker.html';

let margin = 0;

let cycelPos = 0;

function cycelThroughLiveNews() {
  const dom1 = $('.liveNews').eq(cycelPos);
  dom1.fadeOut('slow', function () {
    $('.liveNews').eq(cycelPos).css({ display: 'none' });
    let dom = $('.liveNews').eq(cycelPos += 1);
    if ($('.liveNews').length === cycelPos) {
      cycelPos = 0;
      dom = $('.liveNews').eq(cycelPos);
    }
    dom.css({ display: 'inline' });
    dom.fadeIn('slow');
  });
}

Template.liveTicker.helpers({
  liveNewsLoader() {
    return LiveNewsCollection.find({});
  },
});

Template.liveTickerFloat.helpers({
  liveNewsLoader() {
    return LiveNewsCollection.find({});
  },
});

function cycelLiveNewsFloating(){
  $('#liveTickerFloater1').css({ 'margin-left': margin -= 1 });
  const r = parseInt($('#liveTickerFloater1').css('width'), 10);
  // console.log(margin + ' <= ' + r);
  if (r <= margin * -1) {
    // console.log('Hit');
    margin = r;
  }
}

Template.liveTickerFloat.onRendered(
  function () {
    Meteor.setInterval(function () {
      cycelLiveNewsFloating();
    }, 33.33);
  });

Template.liveTicker.onRendered(
  function () {
    $('.liveNews').eq(0).css({ display: 'inline' });
    Meteor.setInterval(function () {
      cycelThroughLiveNews();
    }, 10000);
  });
