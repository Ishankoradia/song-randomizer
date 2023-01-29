// Loading env variables while starting the app
import { config } from 'dotenv';
import path from 'path';
config({ path: path.join(__dirname, '../', '.env') });

// Dependencies
import express from 'express';
import cors from 'cors';

// Helpers
import { api, apiError } from './helpers/helper';

// Controllers
import { addSong, deleteSong, getSongs } from './songs/SongController';
import { dbConnect } from './loaders/database';

// Initializing Express App
const app = express();

// Parse the request body
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// Database loader
dbConnect()

// Enable CORS
app.use(cors());

// Listen to a port
app.listen(process.env.PORT || 7860, () => {

    console.log(`Server started on port ${process.env.PORT || 7860}`);
});

// Add a song
app.route('/api/songs').post(addSong)

// Fetch all songs
app.route('/api/songs').get(getSongs)

// Delete song
app.route('/api/songs').delete(deleteSong)