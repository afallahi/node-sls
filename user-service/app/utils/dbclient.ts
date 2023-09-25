import { Client } from "pg";

export const DBClient = () => {
    return new Client({
        host: "127.0.0.1",
        database: "user_service",
        user: "root",
        password: "root",
        port: 5432,
    });
}