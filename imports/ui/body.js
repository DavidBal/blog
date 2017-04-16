import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Accounts } from 'meteor/accounts-base';
import { $ } from 'meteor/jquery';

import { PostCollection, ImageCollection } from '../api/database.js';

import './routing.js';
import './template/editor.js';
import './template/post_prev.js';
import './template/liveticker.js';

import './body.html';
import './template/post_prev.html';
import './template/editor.html';
import './template/artikel.html';
import './template/signInUp.html';
import './template/tag.html';


if (Meteor.isClient) {
  // Template helper
  Template.artikel.helpers({
    dateHelper() {
      const date = new Date(this.date);
      return `${date.toLocaleDateString()}(${date.toLocaleTimeString()})`;
    },
  });

  Template.containerMain.events({
    'click .create_Post': function onClick() {
      Router.go('/editor/');
    },
  });

  Template.postPrev.events({
  });

  Template.goBack.events({
    'click .go_Back': function onClick() {
      Router.go('/');
    },
    'click .open_Editor': function onClick(event) {
      Router.go(`/editor/${event.currentTarget.id}`);
    },
  });

  Template.signIn.events({
    'click .login-button': function onClick() {
      Meteor.loginWithPassword($('#login-eMail-input').val(), $('#login-Password-input').val());
    },
  });

  Template.login.helpers({
    currentUserEmail() {
      return Meteor.user().emails[0].address;
    },
  });

  Template.login.events({
    'click .logout-button': function onClick() {
      Meteor.logout();
    },
    'click .changePassword-show': function onClick() {
      if ($('#changePassword-dropdown').css('display') === 'none') {
        $('#changePassword-dropdown').css({ display: 'inline' });
      } else {
        $('#changePassword-dropdown').css({ display: 'none' });
      }
    },
    'click .changePassword-button': function onClick() {
      Accounts.changePassword($('#oldPassword').val(), $('#newPassword').val(), function (error) {
        if (typeof error === 'undefined') {
          $('#changePassword-error').html('Done');
        } else {
          $('#changePassword-error').html(error.message);
        }
      });
    },
  });
}
