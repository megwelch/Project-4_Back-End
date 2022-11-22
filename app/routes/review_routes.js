const express = require('express')
const Review = require('../models/reviews')

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
    Review.find({show: showId})
        .populate("owner")
        .then(reviews => {
            return reviews.map((review) => review.toObject())
        })
        .catch(next)
})

////POST route to CREATE review//////////
router.post('/reviews', requireToken, (req, res, next) => {
	// set owner of new example to be current user
	req.body.review.owner = req.user.id

	Review.create(req.body.review)
		// respond to succesful `create` with status 201 and JSON of new "example"
		.then((review) => {
			res.status(201).json({ review: review.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// // SHOW
// // GET /examples/5a7db6c74d55bc51bdf39793
// router.get('/examples/:id', requireToken, (req, res, next) => {
// 	// req.params.id will be set based on the `:id` in the route
// 	Example.findById(req.params.id)
// 		.then(handle404)
// 		// if `findById` is succesful, respond with 200 and "example" JSON
// 		.then((example) => res.status(200).json({ example: example.toObject() }))
// 		// if an error occurs, pass it to the handler
// 		.catch(next)
// })


////PATCH route to UPDATE review//////////
router.patch('/reviews/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.review.owner

	Review.findById(req.params.id)
		.then(handle404)
		.then((review) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, review)

			// pass the result of Mongoose's `.update` to the next `.then`
			return review.updateOne(req.body.review)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/reviews/:id', requireToken, (req, res, next) => {
	Review.findById(req.params.id)
		.then(handle404)
		.then((review) => {
			// throw an error if current user doesn't own `example`
			requireOwnership(req, review)
			// delete the example ONLY IF the above didn't throw
			review.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})


module.exports = router