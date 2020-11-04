const path = require('path')
const express = require('express')
const xss = require('xss')
const CreateDhrService = require('./create-dhr-service')

const createDhrRouter = express.Router()
const jsonParser = express.json()

const serializeCreateDhr = createDhr => ({
    id: createDhr.id,
    title: xss(createDhr.title),
    completed: createDhr.completed
})

createDhrRouter
    .route('/')

    //relevant
    .get((req, res, next) => {
        CreateDhrService.getCreateDhrs(req.app.get('db'))
            .then(createDhrs => {
                res.json(createDhrs.map(serializeCreateDhr))
            })
            .catch(next)
    })

    //relevant
    .post(jsonParser, (req, res, next) => {

        //take the input from the user
        const {
            title,
            completed = false
        } = req.body
        const newCreateDhr = {
            title
        }

        //validate the input
        for (const [key, value] of Object.entries(newCreateDhr))
            if (value == null)
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })

        newCreateDhr.completed = completed;

        //save the input in the db
        CreateDhrService.insertCreateDhr(
                req.app.get('db'),
                newCreateDhr
            )
            .then(createDhr => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${createDhr.id}`))
                    .json(serializeCreateDhr(createDhr))
            })
            .catch(next)
    })

createDhrRouter
    .route('/:createDhr_id')
    .all((req, res, next) => {
        if (isNaN(parseInt(req.params.createDhr_id))) {
            return res.status(404).json({
                error: {
                    message: `Invalid id`
                }
            })
        }
        CreateDhrService.getCreateDhrById(
                req.app.get('db'),
                req.params.createDhr_id
            )
            .then(createDhr => {
                if (!createDhr) {
                    return res.status(404).json({
                        error: {
                            message: `CreateDhr doesn't exist`
                        }
                    })
                }
                res.createDhr = createDhr
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeCreateDhr(res.createDhr))
    })

    //relevant
    .patch(jsonParser, (req, res, next) => {
        //take the input from the user
        const {
            title,
            completed
        } = req.body
        const createDhrToUpdate = {
            title,
            completed
        }

        //validate the input
        const numberOfValues = Object.values(createDhrToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must content either 'title' or 'completed'`
                }
            })

        //save the input in the db
        CreateDhrService.updateCreateDhr(
                req.app.get('db'),
                req.params.createDhr_id,
                createDhrToUpdate
            )
            .then(updatedCreateDhr => {
                res.status(200).json(serializeCreateDhr(updatedCreateDhr[0]))
            })
            .catch(next)
    })

    //relevant
    .delete((req, res, next) => {
        CreateDhrService.deleteCreateDhr(
                req.app.get('db'),
                req.params.createDhr_id
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })


module.exports = createDhrRouter
