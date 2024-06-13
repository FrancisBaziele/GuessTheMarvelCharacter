const mongoose = require("mongoose");
const schema = mongoose.Schema;

const quotesSchema = new schema({
    quoteId: String,
    movieId: String,
    interestScore: {
        usersInterested: Number,
        usersVoted: Number,
    },
    lines: [
        {
            speaker: String,
            text: String,
            hasStageDirections: Boolean,
            hasSpeaker: Boolean,
        },
    ],
});

module.exports = mongoose.model("Quote", quotesSchema);
