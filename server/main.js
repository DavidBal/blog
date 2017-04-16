import { Meteor } from 'meteor/meteor';

import { PostCollection, TagCollection, ImageCollection, LiveNewsCollection } from '../imports/api/database.js';

/* Publish Databases to the Client*/
Meteor.publish('postCollection', () => PostCollection.find({}));
Meteor.publish('tagCollection', () => TagCollection.find({}));
Meteor.publish('imageCollection', () => ImageCollection.find({}));
Meteor.publish('liveNewsCollection', () => LiveNewsCollection.find({}));

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({

});
