import express from 'express';
import characterRoutes from './routes/characterRoutes';
import activeGroupRoutes from './routes/activeGroupRoutes';
import historyRoutes from './routes/historyRoutes';

const app = express();
app.use(express.json());

app.use('/api/characters', characterRoutes);
app.use('/api/active-group', activeGroupRoutes);
app.use('/api/history', historyRoutes);

export default app;
