/* Routing*/
import { Router } from 'meteor/iron:router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { PostCollection } from '../api/database.js';

const filters = {
  authenticate () {
    let user;

    if (Meteor.loggingIn()) {
      this.render('Loading');
    } else {
      user = Meteor.user();

      if (!user) {
        this.render('signIn');
        return;
      }

      if (!Roles.userIsInRole(user, ['admin'])) {
        this.render('NoAcess');
        return;
      }

      console.log('[authenticate filter] done');
      this.next();
    }
  },
};

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
      this.render('highlightUi', { to: 'highlights' });
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
      this.render('goBack', { to: 'footer', data: artikel });
      this.render('image', { to: 'highlights', data: artikel });
    },
  });

  Router.route('/editor', {
    loadingTemplate: 'Loading',

    before: filters.authenticate,

    waitOn() {
      return Meteor.subscribe('postCollection');
    },

    action() {
      this.layout('containerMain');
      this.render('', { to: 'header' });
      this.render('editor', { to: 'content' });
      this.render('', { to: 'footer' });
    },
  });

  Router.route('/editor/:_id', {
    loadingTemplate: 'Loading',

    before: filters.authenticate,

    waitOn() {
      return Meteor.subscribe('postCollection');
    },

    action() {
      this.layout('containerMain');
      const artikel = PostCollection.findOne({ _id: this.params._id });
      this.render('', { to: 'header' });
      this.render('editor', { to: 'content', data: artikel });
      this.render('', { to: 'footer' });
    },
  });
}

Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });
Router.configure({ notFoundTemplate: '404' });
