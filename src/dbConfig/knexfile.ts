import type { Knex } from "knex";
import dotenv from 'dotenv';
dotenv.config({});

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
            // console.log(err)
            done(err, conn);
          }
          else {
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
    client: 'pg',
    connection: {
      connectionString: process.env.DB_CONNECTION_URL,
      ssl: {rejectUnauthorized : false}
  },
  debug: true,
    migrations: {
      tableName: 'gibby_migrations',
      directory : './migrations'
    },
    
    pool: {
      afterCreate: function (conn:any, done :any) {
        // in this example we use pg driver's connection API
        conn.query('SET timezone="UTC";', function (err : Error) {
          if (err) {
            // first query failed,
            // return error and don't try to make next query
            done(err, conn);
          } else {
            // do the second query...
            done(err, conn);
          }
        });
      },
    },
  }
};
export default config;
