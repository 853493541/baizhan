import express from 'express';
import cors from 'cors';

import characterRoutes from './routes/characterRoutes';
import activeSchedulingRoutes from './routes/activeSchedulingRoutes';
import currentScheduleRoutes from './routes/currentScheduleRoutes';



const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/characters', characterRoutes);
app.use('/api/active-scheduling', activeSchedulingRoutes);
app.use('/api/current-schedule', currentScheduleRoutes);


export default app;
