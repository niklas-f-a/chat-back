import * as makeMongoStore from 'connect-mongodb-session';
import session from 'express-session';

export const makeMongo = ({
  uri,
  collection,
}: {
  uri: string;
  collection: string;
}) => {
  const MongoDBStore = makeMongoStore(session);

  const store = new MongoDBStore({
    uri,
    collection,
  });

  return store;
};
