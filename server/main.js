import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { PostCollection } from '../imports/api/database.js';

/* Publish Databases to the Client*/
Meteor.publish('postCollection', () => PostCollection.find({}));

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  opUser (userId) {
    return Roles.addUsersToRoles(userId, 'admin', Roles.GLOBAL_GROUP);
  },
  checkIfUserIsAdmin (userId) {
    return Roles.userIsInRole(userId, 'admin');
  },
});
