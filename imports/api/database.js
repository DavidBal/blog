import { Mongo } from 'meteor/mongo';

export const PostCollection = new Mongo.Collection('postCollection');
export const TagCollection = new Mongo.Collection('tagCollection');
