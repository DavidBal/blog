/* Routing*/
import { Router } from 'meteor/iron:router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
// import { $ } from 'meteor/jquery';

import { PostCollection, ImageCollection } from '../api/database.js';

import './body.html';
import './template/liveticker.html';
import './template/post_prev.html';
import './template/organize.html';

function databaseSubscribe() {
  return Meteor.subscribe('postCollection') && Meteor.subscribe('tagCollection') && Meteor.subscribe('imageCollection') && Meteor.subscribe('liveNewsCollection');
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

    /*onAfterAction() {
      if (!Meteor.isClient) {
        return;
      }
      SEO.set({
        title: 'Die3Affen',
        meta: {
          description: 'Text',
        },
        og: {
          title: 'Die3Affen',
          description: 'Text',
        },
      });
    },*/

    action() {
      this.layout('containerMain');
      this.render('imagePrevContainer', { to: 'content' });
      this.render('', { to: 'footer' });
      this.render('highlightUi', { to: 'highlights' });
    },
  }, { name: 'home' });

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

  Router.route('/post', {
    loadingTemplate: 'Loading',

    waitOn() {
      return databaseSubscribe();
    },

    action() {
      this.render('postAImage');
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

  Router.route('/organize', {
    waitOn() {
      return databaseSubscribe();
    },
    action() {
      this.render('organize');
    },
  });

  Router.route('/imgshare/:_id', {
    name: 'imgshare',

    waitOn() {
      return Meteor.subscribe('imageCollection');
    },
    data() {
      const img = ImageCollection.findOne(this.params._id);
      return { img };
    },
    onAfterAction() {
      const img = this.data().img;
      SEO.set({
        og: {
          title: img._id,
          image: img.url,
          // 'image:type': 'article',
          'image:url': img.url,
          'image:width': 300,
          'image:height': 300,
        },
      });
    },
    action() {
      this.render('body');
    },
  });
}


Router.plugin('dataNotFound', { notFoundTemplate: 'notFound' });
Router.configure({ notFoundTemplate: '404' });
