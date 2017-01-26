var mongoose = require("mongoose");
var random = require('mongoose-simple-random');

var goodThingSchema = mongoose.Schema({
    thing: String,
});
goodThingSchema.plugin(random);

var GoodThing = mongoose.model('goodThing', goodThingSchema);
module.exports = GoodThing;