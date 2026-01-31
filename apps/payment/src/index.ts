import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import Rotas from './routes/qr_code';
import Properties from '#properties/index';

const app = express();

export async function initializeServices(): Promise<void> {
    try {
        app.use(express.json());

        app.use(express.json({ limit: '10MB' }));
        app.use(express.urlencoded({ extended: false }));

        Rotas(app);

        app.get('/health', (req, res) => res.sendStatus(200));

        const server = app.listen(Properties.port, () => {
            console.warn(`Application running on  ${Properties.port}`);
        });

        // eslint-disable-next-line no-inner-declarations
        function gracefulShutdown(_: string) {
            return (_: string) => {
                server.close(() => {
                    console.info(`[*] - CORE WEB Service - Closed`);
                });
            };
        }

        process.on('SIGINT', gracefulShutdown('SIGINT'));
        process.on('SIGTERM', gracefulShutdown('SIGTERM'));
    } catch (error) {
        console.error('Error initializing services:', error);
        process.exit(1);
    }
}

void initializeServices();
