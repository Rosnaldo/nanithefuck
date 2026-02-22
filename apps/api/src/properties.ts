export default {
    nodeEnv: process.env.API_NODE_ENV || 'dev',
    port: process.env.API_PORT || 5002,
    mongoUri: process.env.API_MONGO_URI || 'mongodb://admin:secret@localhost:27017/mydatabase?authSource=admin&authMechanism=SCRAM-SHA-256',
    awsRegion: process.env.AWS_REGION,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: process.env.AWS_S3_BUCKET,
    keycloakUri: process.env.KEYCLOAK_URI || 'http://localhost:8080',
    keycloakClientApiId: process.env.KEYCLOAK_CLIENT_API_ID || 'api',
    keycloakClientApiSecret: process.env.KEYCLOAK_CLIENT_API_SECRET || 'secret',
    isRuntime: process.env.RUNTIME || 'js',
};
