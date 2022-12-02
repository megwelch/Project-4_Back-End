const express = require('express')
const Review = require('../models/reviews')
const TvShow = require('../models/tvshows')

const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()
const customErrors = require('../../lib/custom_errors')
const removeBlanks = require('../../lib/remove_blank_fields')
const requireOwnership = customErrors.requireOwnership
const handle404 = customErrors.handle404


///////GET route to INDEX reviews by show//////
router.get('/reviews/:showId', (req, res, next) => {
    const showId = req.params.showId
    Review.find({apiId: showId})
        .then(reviews => {
            return reviews.map(review => review)
        })
        .then(reviews => {
            res.status(200).json({ reviews: reviews })
        })
        .catch(next)
})

////POST route to CREATE review//////////
router.post('/reviews/:showId', requireToken, (req, res, next) => {
	req.body.review.owner = req.user.id
    Review.create(req.body.review)
        .then(review => {
            TvShow.findById(review.tvshow)
                .then(tvshow => {
                    res.status(201).json({ review: review.toObject() })
                })
                review.save()
        })
        .catch(next)
})

////PATCH route to UPDATE review//////////
router.patch('/reviews/:id', requireToken, removeBlanks, (req, res, next) => {
	delete req.body.review.owner
	Review.findById(req.params.id)
		.then(handle404)
		.then((review) => {
			requireOwnership(req, review)
			return review.updateOne(req.body.review)
            
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

// DESTROY
router.delete('/reviews/:id', requireToken, (req, res, next) => {
	Review.findByIdAndDelete(req.params.id)
		// .then(handle404)
		// .then((review) => {
		// 	requireOwnership(req, review)
		// 	review.deleteOne()
		// })
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router