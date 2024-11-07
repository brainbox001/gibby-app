import type { Knex } from "knex";
import dotenv from 'dotenv';
dotenv.config();
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "C:/Users/User/Desktop/gibby-app/gibby.sqlite"
    },
    debug : true,
    pool: {
      min: 0,
      afterCreate: (conn:any, done:(err:typeof Error, conn: any) => any) => {

        conn.run('PRAGMA foreign_keys = ON', (err: typeof Error) => {
          if (err) {
            console.log(err)
            done(err, conn);
          }
          else {
            console.log('successful')
            done(err, conn);
          }
        });
      }
    },
    migrations: {
      tableName: 'db_migrations'
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
  },
    migrations: {
      tableName: 'knex_migrations'
    },
    pool: {
      afterCreate: (conn:any, done:(err:typeof Error, conn: any) => any) => {
        conn.ping((err: typeof Error, fin: typeof Error) => {
          if (err) {
            console.error('Database connection failed:', err);
            done(err, conn);
          } else {
            console.log('Database connected successfully.');
            done(fin, conn);
          }
        });
      }
    }
  }
};
export default config;