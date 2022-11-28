const express = require('express')
const passport = require('passport')

const TvShow = require('../models/tvshows')

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

	TvShow.create(req.body.tvShow)
		// respond to succesful `create` with status 201 and JSON of new "example"
		.then((tvShow) => {
			res.status(201).json({ tvShow: tvShow.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

router.get('/favorites', (req, res, next) => {
    TvShow.find({ owner: req.user.id })
        .populate("owner")
        .then(tvShows => {
			console.loy(tvShows)
            return tvShows.map((tvShow) => tvShow.toObject())
        })
        .catch(next)
})

module.exports = router
