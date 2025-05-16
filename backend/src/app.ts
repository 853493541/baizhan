import express from 'express';
import characterRoutes from './routes/characterRoutes';
import activeSchedulingRoutes from './routes/activeSchedulingRoutes';
import historyRoutes from './routes/historyRoutes';
import currentScheduleRoutes from './routes/currentScheduleRoutes';
import setCurrentSchedule from './routes/currentScheduleRoutes';



import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/characters', characterRoutes);
app.use('/api/active-scheduling', activeSchedulingRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/current-schedule', currentScheduleRoutes);
app.use('/api/setCurrentSchedule', setCurrentSchedule);
app.use('/api/characters', characterRoutes); 


export default app;
