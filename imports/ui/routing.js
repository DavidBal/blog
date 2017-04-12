/* Routing*/
import { Router } from 'meteor/iron:router';
import { Meteor } from 'meteor/meteor';
import { PostCollection } from '../api/database.js';

if (Meteor.isClient) {
  Router.route('/', {
    loadingTemplate: 'Loading',

    waitOn() {
      return Meteor.subscribe('postCollection');
    },

    action() {
      this.layout('containerMain');
      this.render('text_prevLoader', { to: 'content' });
      this.render('', { to: 'footer' });
    },
  });

  Router.route('/artikel/:_id', {
    loadingTemplate: 'Loading',

    waitOn() {
      return Meteor.subscribe('postCollection');
    },

    action() {
      this.layout('containerMain');
      const artikel = PostCollection.findOne({ _id: this.params._id });
      this.render('artikel', { to: 'content', data: artikel });
      this.render('goBack', { to: 'footer' });
    },
  });

  Router.route('/editor', {
    loadingTemplate: 'Loading',

    waitOn() {
      return Meteor.subscribe('postCollection');
    },

    action() {
      this.layout('containerMain');
      this.render('editor', { to: 'content' });
      this.render('', { to: 'footer' });
    },
  });

  Router.route('/editor/:_id', {
    loadingTemplate: 'Loading',

    waitOn() {
      return Meteor.subscribe('postCollection');
    },

    action() {
      this.layout('containerMain');
      const artikel = PostCollection.findOne({ _id: this.params._id });
      this.render('editor', { to: 'content', data: artikel });
      this.render('', { to: 'footer' });
    },
  });
}
