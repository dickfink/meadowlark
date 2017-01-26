var mongoose = require("mongoose");

var goodThingSchema = mongoose.Schema({
    thing: String,
});

var GoodThing = mongoose.model('goodThing', goodThingSchema);
module.exports = GoodThing;