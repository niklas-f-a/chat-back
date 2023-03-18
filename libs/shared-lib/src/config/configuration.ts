export default () => ({
  port: process.env.API_PORT ? parseInt(process.env.API_PORT) : 5001,
  rabbitOptions: {
    url: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`,
    queue: {
      auth: process.env.RABBITMQ_AUTH_QUEUE,
      chat: process.env.RABBITMQ_CHAT_QUEUE,
      user: process.env.RABBITMQ_USER_QUEUE,
    },
  },
  session: {
    secret: process.env.SESSION_SECRET,
    collection: process.env.SESSION_COLLECTION,
  },
  authDb: {
    uri: `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}${process.env.MONGO_OPTIONS}`,
  },
});
