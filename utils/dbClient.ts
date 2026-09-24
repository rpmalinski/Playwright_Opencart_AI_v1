import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export async function executeQuery(sql: string, params?: any[]){
    const connectionConfig: any = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };

    // Use socketPath if provided (e.g. for XAMPP with skip-networking),
    // otherwise fall back to host/port.
    if (process.env.DB_SOCKET) {
        connectionConfig.socketPath = process.env.DB_SOCKET;
    } else {
        connectionConfig.host = process.env.DB_HOST;
        connectionConfig.port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
    }

    const connection = await mysql.createConnection(connectionConfig);

    const [result] = await connection.execute(sql, params);
    await connection.end();
    return result;
}