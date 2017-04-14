import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { $ } from 'meteor/jquery';

import { PostCollection } from '../api/database.js';

import './routing.js';
import './template/editor.js';

import './body.html';
import './template/post_prev.html';
import './template/editor.html';
import './template/artikel.html';
import './template/signInUp.html';


let slideIndex = 1;

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

  Template.containerMain.events({
    'click .create_Post': function onClick() {
      Router.go('/editor/');
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
}
