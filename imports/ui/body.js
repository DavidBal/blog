import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Accounts } from 'meteor/accounts-base';
import { $ } from 'meteor/jquery';

import { PostCollection, ImageCollection } from '../api/database.js';

import './routing.js';
import './template/editor.js';

import './body.html';
import './template/post_prev.html';
import './template/editor.html';
import './template/artikel.html';
import './template/signInUp.html';
import './template/tag.html';


let slideIndex = 1;
let counter = 4;

function showDivs(n) {
  let i;
  const x = document.getElementsByClassName('highlight');
  if (n > x.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = x.length;
  }
  for (i = 0; i < x.length; i += 1) {
    x[i].style.display = 'none';
  }
  x[slideIndex - 1].style.display = 'block';
}

function plusDivs(n) {
  showDivs(slideIndex += n);
}

if (Meteor.isClient) {
  // Template helper
  Template.imagePrevContainer.helpers({
    loadPosts() {
      console.log('Helper Called');
      const result = ImageCollection.find({}, { sort: { date: -1 }, limit: 4 });
      console.log(result);
      return result;
    },
  });

  Template.imagePrevContainer_afterLoad.helpers({
    loadPosts() {
      console.log('Helper Called' + counter);
      const result = ImageCollection.find({}, {
        sort: { date: -1 },
        skip: counter,
        limit: 4 });
      console.log(result);
      counter += 4;
      return result;
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

  Template.highlightUi.events({
    'click .next': function onClick() {
      plusDivs(+1);
    },
    'click .before': function onClick() {
      plusDivs(-1);
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
