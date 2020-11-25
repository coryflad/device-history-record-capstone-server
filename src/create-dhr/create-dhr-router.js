const path = require('path')
const express = require('express')
const xss = require('xss')
const CreateDhrService = require('./create-dhr-service')

const createDhrRouter = express.Router()
const jsonParser = express.json()

const serializeCreateDhr = createDhr => ({
    id: createDhr.id,
    date_created: xss(createDhr.date_created),
    device_name: xss(createDhr.device_name),
    device_sn: xss(createDhr.device_sn),
    dmr_no: xss(createDhr.dmr_no),
    document_id: createDhr.document_id,
    wo_no: createDhr.wo_no,
    network_analyzer: createDhr.network_analyzer,
    power_supply: createDhr.power_supply,
    s21_probe: createDhr.s21_probe,
    calibration_standard: createDhr.calibration_standard,
    user_id: createDhr.currentUserId
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
            date_created, device_name, device_sn, dmr_no, document_id, wo_no, currentUserId, network_analyzer = 0, power_supply = 0, s21_probe = 0, calibration_standard = 0
        } = req.body
        const newCreateDhr = {
            date_created, device_name, device_sn, dmr_no, document_id, wo_no, user_id: currentUserId, network_analyzer, power_supply, s21_probe, calibration_standard
        }

        //validate the input
        for (const [key, value] of Object.entries(newCreateDhr))
            if (value == null)
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })

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
            date_created, device_name, device_sn, dmr_no, document_id, wo_no, currentUserId, network_analyzer = 0, power_supply = 0, s21_probe = 0, calibration_standard = 0
        } = req.body
        const createDhrToUpdate = {
            date_created, device_name, device_sn, dmr_no, document_id, wo_no, user_id: currentUserId, network_analyzer, power_supply, s21_probe, calibration_standard
        }

        //validate the input
        const numberOfValues = Object.values(createDhrToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body is missing fields`
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
