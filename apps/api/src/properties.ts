export default {
    nodeEnv: process.env.API_NODE_ENV || 'dev',
    port: process.env.API_PORT || 5002,
    mongoUri: process.env.API_MONGO_URI || 'mongodb://admin:secret@localhost:27017/mydatabase?authSource=admin&authMechanism=SCRAM-SHA-256',
};
