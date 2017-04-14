/* Routing*/
import { Router } from 'meteor/iron:router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { PostCollection } from '../api/database.js';

function databaseSubscribe() {
  return Meteor.subscribe('postCollection') && Meteor.subscribe('tagCollection');
}

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
      this.next();
    }
  },
};

if (Meteor.isClient) {
  Router.route('/', {
    loadingTemplate: 'Loading',

    waitOn() {
      return databaseSubscribe();
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
      return databaseSubscribe();
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
      return databaseSubscribe();
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
      return databaseSubscribe();
    },

    action() {
      this.layout('containerMain');
      const artikel = PostCollection.findOne({ _id: this.params._id });
      this.render('', { to: 'header' });
      this.render('editor', { to: 'content', data: artikel });
      this.render('', { to: 'footer' });
    },
  });

  Router.route('/login', {
    waitOn() {
      return databaseSubscribe();
    },
    action() {
      this.render('login');
    },
  });
}


Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });
Router.configure({ notFoundTemplate: '404' });
