import { RequestHandler } from "express";
import { api, apiError } from "../helpers/helper";
import { v4 as uuidv4 } from "uuid";

// Database connection instance
import { db } from "../loaders/database";

export const addSong: RequestHandler = async (req, res) => {
    try {

        if (!req.body.name)
            throw { mes: 'Please enter the song name', code: 422 }

        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO ${process.env.DB_NAME} (id, name, url, is_market_india) VALUES (?, ?, ?, ?)`,
                [uuidv4(), req.body.name, req.body.url || '', req.body.is_market_india],
                (err: any) => {
                    if (err) {
                        reject({ mes: err.message, code: 500 })
                    }
                    resolve({})
                })
        })

        return api('Song added successfully', res, {})

    } catch (e: any) {

        return apiError(e.mes ? e.mes : String(e), res, {}, e.code ? e.code : 500);
    }
};

export const getSongs: RequestHandler = async (req, res) => {
    try {

        let rows: any[] = await new Promise((resolve, reject) => {
            let query: string = `SELECT * FROM ${process.env.DB_NAME} `

            let queryParams: string = ''

            if (req.query.s)
                queryParams += `WHERE name like '${req.query.s}' `

            if (req.query.is_market_india)
                queryParams += `${queryParams ? 'AND' : 'WHERE'} is_market_india = '${req.query.is_market_india}' `

            query += queryParams

            if (req.query.limit)
                query += `LIMIT ${req.query.limit} `

            db.all(query, [], (err: any, rows: any) => {
                if (err) {
                    reject({ mes: err.message, code: 500 })
                }

                resolve(rows)
            })
        })

        return api('Song fetched successfully', res, rows)

    } catch (e: any) {

        return apiError(e.mes ? e.mes : String(e), res, {}, e.code ? e.code : 500);
    }
};

export const deleteSong: RequestHandler = async (req, res) => {
    try {

        if (!req.body.song_id)
            throw { mes: 'Invalid request. Please the song to delete', code: 422 }

        let rows = await new Promise((resolve, reject) => {
            let query = `DELETE FROM ${process.env.DB_NAME} `

            query += `WHERE id = '${req.body.song_id}'`

            db.all(query, [], (err: any, rows: any) => {
                if (err) {
                    reject({ mes: err.message, code: 500 })
                }

                resolve(rows)
            })
        })

        return api('Song deleted successfully', res, rows)

    } catch (e: any) {

        return apiError(e.mes ? e.mes : String(e), res, {}, e.code ? e.code : 500);
    }
};
