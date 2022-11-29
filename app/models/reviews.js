const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
	{
		comment: {
			type: String,
			required: true,
		},
        owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
        tvshow: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Show'
        },
        apiId: {
            type: Number
        },
	},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Review', ReviewSchema)
