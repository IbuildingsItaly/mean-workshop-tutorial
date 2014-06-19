
var mongoose = require('mongoose');


// Validation
// =============================================================================

// SHARED VALIDATION FUNCTIONS
var isNotTooShort = function(string) {
    return string && string.length >= 3;
};

var onlyLettersAllow = function(string) {
    var myRegxp = /^[a-zA-Z]+$/i;
    return  myRegxp.test(string);
};

// External email validation object
var validateEmail = [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid email address"];

// SCHEMAS
// ============================================================================



// userSchema
// ============================================================================

var customValidator = [
    { validator: isNotTooShort, msg: 'Is too short' },
    { validator: onlyLettersAllow, msg: 'Only Letters' }
];

//OR
//
//userSchema.path('username').validate(isNotTooShort, 'Is too short');
//userSchema.path('username').validate(onlyLettersAllow, 'Only Letters');

var userSchema = new mongoose.Schema({
    username: {type: String,required: true,validate:customValidator,lowercase: true, trim: true},
    password: {type: String,required: true,lowercase: true, trim: true},
    email: {type: String, required : true, validate: validateEmail },
    createdOn: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});

//check that username and email are unique
userSchema.index({ username: 1, email: 1 }, { unique: true });


/**
 * Hook a pre save method to sanitize username
 */
userSchema.pre('save', function(next) {
    this.username = this.username.replace(/\s/g, '_')
    next();
});


mongoose.model( 'User', userSchema );

// EventSchema
// ============================================================================

var eventSchema = new mongoose.Schema({
    title : {type: String,required:true},
    date: { type: String },
    description: { type: String },
    time : { type: String },
    url : {type: String},
    position : {type: mongoose.Schema.Types.Mixed}
});

// Duplicate the ID field.
eventSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
eventSchema.set('toJSON', {
    virtuals: true
});


mongoose.model( 'Event', eventSchema);


// planSchema
// ============================================================================

var planSchema = new mongoose.Schema({
    title : {type: String,trim: true},
    owner : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    description : {type: String,trim: true},
    createdOn: { type: Date, default: Date.now },
    events: [eventSchema]
});

// Duplicate the ID field.
planSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
planSchema.set('toJSON', {
    virtuals: true
});

planSchema.index({ title: 1, owner: 1 }, { unique: true });


mongoose.model( 'Plan', planSchema);


