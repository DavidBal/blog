import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { $ } from 'meteor/jquery';

import { PostCollection } from '../api/database.js';


import './body.html';
import './template/post_prev.html';
import './routing.js';
import './template/editor.html';
import './template/artikel.html';

if (Meteor.isClient) {
  // Template helper
  Template.textPrevLoader.helpers({
    loadPosts() {
      return PostCollection.find({}, { sort: { date: -1 } });
    },
  });

  Template.postPrev.helpers({
    textshorter() {
      let textprev = this.text;
      textprev = textprev.replace(new RegExp('<br/>', 'g'), '');
      return `${textprev.slice(0, 500)}...`;
    },
  });

  Template.editor.helpers({
    textformater(text) {
      if (text === null) {
        return '';
      }
      return text.replace(new RegExp('<br/>', 'g'), '\n');
    },
  });

  Template.postPrev.events({
    'click .postPrev': function onClick(event) {
      Router.go(`/artikel/${event.currentTarget.id}`);
    },
  });

  Template.goBack.events({
    'click .go_Back': function onClick() {
      Router.go('/');
    },
  });

  Template.editor.events({
    'click .save': function onClick() {
      const title = $('#title').val();
      const text = $('#text').val();
      const date = new Date().toISOString();
      const id = PostCollection.insert({ title, text, date });
      Router.go(`/artikel/${id}`);
    },
    'click .edit': function onClick(event) {
      const title = $('#title').val();
      let text = $('#text').val();
      text = text.replace(/\r\n/g, '<br/>');
      text = text.replace(/\n/g, '<br/>');
      text = text.replace(/\n/g, '<br/>');
      const id = event.currentTarget.id;
      const date = new Date().toISOString();
      PostCollection.update(id, { title, text, date });
      Router.go(`/artikel/${id}`);
    },
  });
}
