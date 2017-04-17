import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import { LiveNewsCollection } from '/imports/api/database.js';

import './organize.html';

Template.orgaLiveTicker.helpers({
  loadLiveNews() {
    return LiveNewsCollection.find({});
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

Template.liveNewsRow.events({
  'click .deleteNews': function onClick(event) {
    LiveNewsCollection.remove({ _id: event.currentTarget.id });
  },
});
