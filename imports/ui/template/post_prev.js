import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Blaze } from 'meteor/blaze';
import { $ } from 'meteor/jquery';

import { ImageCollection } from '/imports/api/database.js';
import './post_prev.html';

let slideIndex = 0;
let counter = 4;

function renderHiglightPrev() {
  let dom = $('.imagePrev').get(slideIndex);
  let domNext = $('.imagePrev').get(slideIndex + 1);
  slideIndex += 1;

  if (typeof dom === 'undefined') {
    slideIndex = 0;
    dom = $('.imagePrev').get(slideIndex);
    slideIndex += 1;
  }
  if (typeof domNext === 'undefined') {
    domNext = $('.imagePrev').get(0);
  }
  const url = ImageCollection.findOne({ _id: dom.id }).url;
  const urlNext = ImageCollection.findOne({ _id: domNext.id }).url;
  $('#highlightImage_holder_back').animate({ opacity: 1 }, 1500, function () {
    $('#highlightImage_holder').css({ 'background-image': `url(${url})` });
    $('#highlightImage_holder_back').css({ opacity: 0 });
    $('#highlightImage_holder_back').css({ 'background-image': `url(${urlNext})` });
  });
}

if (Meteor.isClient) {
  Template.imagePrevContainer.helpers({
    loadPosts() {
      const result = ImageCollection.find({}, { sort: { date: -1 }, limit: 4 });
      return result;
    },
  });

  Template.imagePrevContainerAfterLoad.helpers({
    loadPosts() {
      const result = ImageCollection.find({}, {
        sort: { date: -1 },
        skip: counter,
        limit: 4 });
      counter += 4;
      return result;
    },
  });

  Template.imagePrev.helpers({
    dateHelper() {
      const date = new Date(this.date);
      return `${date.toLocaleDateString()}(${date.toLocaleTimeString()})`;
    },
  });

  Template.imagePrevContainer.events({
    'click .loadmore': function onClick() {
      Blaze.render(Template.imagePrevContainer_afterLoad, $('.imagePrevContainer').get(0));
    },
  });

  Template.postPrev.helpers({
    textshorter() {
      let textprev = this.text;
      textprev = textprev.replace(new RegExp('<br/>', 'g'), '');
      return `${textprev.slice(0, 500)}...`;
    },
    dateHelper() {
      const date = new Date(this.date);
      return `${date.toLocaleDateString()}(${date.toLocaleTimeString()})`;
    },
  });

  Template.highlightUi.onRendered(
    function () {
      $('#highlightImage_holder_back').css({ opacity: 0 });
      let dom = $('.imagePrev').get(slideIndex);
      let domNext = $('.imagePrev').get(slideIndex + 1);
      slideIndex += 1;

      // Check that there is a NEXT id
      if (typeof dom === 'undefined') {
        slideIndex = 0;
        dom = $('.imagePrev').get(slideIndex);
        slideIndex += 1;
      }
      if (typeof domNext === 'undefined') {
        domNext = $('.imagePrev').get(0);
      }
      const url = ImageCollection.findOne({ _id: dom.id }).url;
      const urlNext = ImageCollection.findOne({ _id: domNext.id }).url;
      $('#highlightImage_holder').css({ 'background-image': `url(${url})` });
      $('#highlightImage_holder_back').css({ 'background-image': `url(${urlNext})` });
      Meteor.setInterval(function() {
        renderHiglightPrev();
      }, 5000);
    });
}
