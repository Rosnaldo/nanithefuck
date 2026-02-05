import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Properties from './properties';

import { LoadRoutes } from '#routes/config/load_routes';
import { mongooseBootstrap } from 'mongoose_bootstrap';
import { populate } from '#populate';

const app = express();

export async function initializeServices(): Promise<void> {
    let isShuttingDown = false;

    try {
        await mongooseBootstrap();
        // await populate();

        app.use(cors());
        app.use(express.json());

        app.use(express.json({ limit: '10MB' }));
        app.use(express.urlencoded({ extended: false }));

        app.get('/health', (req, res) => res.sendStatus(200));

        const loadRoutes = new LoadRoutes(app);
        await loadRoutes.synchronous();

        const server = app.listen(Properties.port, () => {
            console.log(`Application running on  ${Properties.port}`);
        });

        const gracefulShutdown = async () => {
            if (isShuttingDown) return;
            isShuttingDown = true;

            try {
                await Promise.all(mongoose.connections.map((conn) => conn.close(false)));
                console.log('[DB] Todas as conexões Mongo fechadas');
            } catch (err) {
                console.error('[DB] Erro ao fechar conexões', err);
            }
            server.close(() => {
                console.log(`[*] - WEB Service - Closed`);
                process.exit(0);
            });

            // Fallback de segurança (ex: conexões presas)
            setTimeout(() => {
                console.error('Forçando shutdown após timeout');
                process.exit(1);
            }, 10_000);
        }

        process.on('SIGINT', gracefulShutdown);
        process.on('SIGTERM', gracefulShutdown);
    } catch (error) {
        console.error('Error initializing services:', error);
        process.exit(1);
    }
}

void initializeServices();
