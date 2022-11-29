const express = require('express')
const passport = require('passport')

const TvShow = require('../models/tvshows')
const User = require('../models/user')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE
// POST /examples
router.post('/favorites', requireToken, (req, res, next) => {
	// set owner of new example to be current user
	req.body.tvShow.owner = req.user.id
	console.log(req.user.id)

	TvShow.create(req.body.tvShow)
		// respond to succesful `create` with status 201 and JSON of new "example"
		.then((tvShow) => {
			console.log(tvShow)
			res.status(201).json({ tvShow: tvShow.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// router.get('/favorites/:id', (req, res, next) => {
// 	console.log(User)
//     TvShow.find()
// 		.populate('owner')
// 		.then(handle404)
//         .then((tvShow) => res.status(200).json({ tvShow: tvShow }))
//         .catch(next)
// })

router.get('/favorites', requireToken, (req, res, next) => {
    // req.params.id will be set based on the `:id` in the route
	// console.log('req inside of favorites index', req)
    TvShow.find({owner: req.user.id})
        .populate('owner')
        .then(handle404)
        // if `findById` is succesful, respond with 200 and "post" JSON
        // .then((tvShow) => res.status(200).json({ tvShow: tvShow.toObject() }))
        .then(tvShow => {
            res.status(200).json({ tvShow: tvShow})
        })
        // if an error occurs, pass it to the handler
        .catch(next)
})

module.exports = router
