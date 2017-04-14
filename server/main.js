import { Meteor } from 'meteor/meteor';

import { PostCollection, TagCollection } from '../imports/api/database.js';

/* Publish Databases to the Client*/
Meteor.publish('postCollection', () => PostCollection.find({}));
Meteor.publish('tagCollection', () => TagCollection.find({}));

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({

});
