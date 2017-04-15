import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { $ } from 'meteor/jquery';

import { PostCollection, ImageCollection, TagCollection } from '/imports/api/database.js';

import './editor.html';

function addTags(tagString) {
  let tag = TagCollection.findOne({ mainTag: tagString });

  if (typeof tag === 'undefined') {
    tag = TagCollection.findOne({ altTags: tagString });
  }
  return tag.mainTag;
}

if (Meteor.isClient) {
  Template.editor.helpers({
    textformater(text) {
      if (text === null) {
        return '';
      }
      return text.replace(new RegExp('<br/>', 'g'), '\n');
    },
  });

  Template.editor.events({
    'click .save': function onClick() {
      const title = $('#title').val();
      let text = $('#text').val();
      const image = $('#image_link').val();
      text = text.replace(/\r\n/g, '<br/>');
      text = text.replace(/\n/g, '<br/>');
      text = text.replace(/\n/g, '<br/>');
      const date = new Date().toISOString();
      const id = PostCollection.insert({ title, text, date, image });
      Router.go(`/artikel/${id}`);
    },
    'click .edit': function onClick(event) {
      const title = $('#title').val();
      let text = $('#text').val();
      const image = $('#image_link').val();
      const changeDate = $('#changeDate').is(':checked');
      text = text.replace(/\r\n/g, '<br/>');
      text = text.replace(/\n/g, '<br/>');
      text = text.replace(/\n/g, '<br/>');
      const id = event.currentTarget.id;
      if (changeDate) {
        const date = new Date().toISOString();
        PostCollection.update(id, { title, text, date, image });
      } else {
        const date = PostCollection.findOne(id).date;
        PostCollection.update(id, { title, text, date, image });
      }
      Router.go(`/artikel/${id}`);
    },
    'click .delete': function onClick(event) {
      const answer = confirm('Wollen Sie den Artikel wircklich loeschen??');
      if (answer) {
        PostCollection.remove(event.currentTarget.id);
        Router.go('/');
      }
    },
  });

  Template.postAImage.events({
    'click .save': function onClick() {
      const url = $('#image_link').val();
      const date = new Date().toISOString();
      ImageCollection.insert({ url, date });
    },
  });
}
