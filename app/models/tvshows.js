const mongoose = require('mongoose')

const tvShowSchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		image: {
			type: String,
		},
		description: {
			type: String,
			
		},
		apiId: {
            type: Number
        },
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	}
)

module.exports = mongoose.model('Show', tvShowSchema)
