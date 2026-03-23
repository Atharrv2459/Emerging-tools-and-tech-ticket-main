import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { testDbConnection } from './src/config/db.js';
import adminRoutes from './src/routes/admin_routes.js';
import { bootstrapAdmin } from './src/config/bootstrapAdmin.js';
import customerRoutes from './src/routes/customer_routes.js';
import managerRoutes from './src/routes/manager_routes.js';


const app = express();

app.use(cors());
app.use(express.json());

await testDbConnection();
await bootstrapAdmin();

app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/manager', managerRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
