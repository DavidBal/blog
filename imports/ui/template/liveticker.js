import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';
import { LiveNewsCollection } from '/imports/api/database.js';


import './liveticker.html';

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

Template.liveTicker.onRendered(
  function () {
    $('.liveNews').eq(0).css({ display: 'inline' });
    Meteor.setInterval(function () {
      cycelThroughLiveNews();
    }, 10000);
  });
