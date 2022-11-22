const mongoose = require('mongoose')

const showSchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		image: {
			type: String,
		},
		rating: {
			type: String,
			
		},
		cast: {
			type: Array,
		
		},
		description: {
			type: String,
			
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		}
	}
)

module.exports = mongoose.model('Show', showSchema)
