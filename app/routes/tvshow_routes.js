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
router.post('/favorites', requireToken, (req, res, next) => {
	req.body.tvShow.owner = req.user.id
	console.log(req.body.tvShow.apiId)
	TvShow.create(req.body.tvShow)
		.then((tvShow) => {
				res.status(201).json({ tvShow: tvShow.toObject() })
		})
		.catch(next)
})

// GET
router.get('/favorites', requireToken, (req, res, next) => {
    TvShow.find({owner: req.user.id})
        .populate('owner')
        .then(handle404)
        .then(tvShow => {
            res.status(200).json({ tvShow: tvShow})
        })
        .catch(next)
})

// DESTROY
router.delete('/favorites/:_id', requireToken, (req, res, next) => {
	TvShow.findById(req.params._id)
		.then(handle404)
		.then((tvshow) => {
			requireOwnership(req, tvshow)
			tvshow.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router
