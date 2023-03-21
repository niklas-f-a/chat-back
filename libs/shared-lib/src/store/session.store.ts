import * as makeMongoStore from 'connect-mongodb-session';
import * as session from 'express-session';

export const makeStore = ({
  uri,
  collection,
  sess,
}: {
  uri: string;
  collection: string;
  sess: typeof session;
}) => {
  const MongoDBStore = makeMongoStore(sess);
  const store = new MongoDBStore({
    uri,
    collection,
  });

  return store;
};
