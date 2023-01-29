const sqlite3 = require('sqlite3').verbose();

export let db: any = null

export const dbConnect = () => {
    db = new sqlite3.Database('./db/songs.db', (err: any) => {
        if (err) {
            return console.log("Something went wrong in connecting the database", err.message);
        }
        console.log('Connected to the songs SQlite database.');

    });

    if (db)
        db.run('CREATE TABLE IF NOT EXISTS songs(id text, name text, url text, is_market_india text)');
}

