import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import { LiveNewsCollection, ImageCollection } from '/imports/api/database.js';

import './organize.html';

Template.orgaLiveTicker.helpers({
  loadLiveNews() {
    return LiveNewsCollection.find({});
  },
});

Template.orgaImagePosts.helpers({
  imageLoader() {
    return ImageCollection.find({});
  },
});

Template.orgaLiveTicker.events({
  'click .addNews': function onClick() {
    const text = $('#addNewsText').val();
    const date = new Date();
    LiveNewsCollection.insert({ text, date });
  },
});

Template.liveNewsRow.helpers({
  dateHelper() {
    const date = new Date(this.date);
    return `${date.toLocaleDateString()}(${date.toLocaleTimeString()})`;
  },
});

Template.imageRow.helpers({
  dateHelper() {
    const date = new Date(this.date);
    return `${date.toLocaleDateString()}(${date.toLocaleTimeString()})`;
  },
});

Template.liveNewsRow.events({
  'click .deleteNews': function onClick(event) {
    LiveNewsCollection.remove({ _id: event.currentTarget.id });
  },
});

Template.imageRow.events({
  'click .deleteNews': function onClick(event) {
    ImageCollection.remove({ _id: event.currentTarget.id });
  },
});

Template.orgaImagePosts.events({
  'click .save': function onClick() {
    const url = $('#addImage').val();
    const date = new Date().toISOString();
    ImageCollection.insert({ url, date });
  },
});
