var express = require('express')
    , db = require('./model/db')
    , passport = require('passport')
    , bodyParser = require('body-parser')
    , app = express()
    , logger = require("./logger")
    , token = require('./middlewares/token')
    , port = process.env.PORT || 12345 // set our port
    , cors = require('cors')
	, authorization = require('./config/authorization');

    corsOptions = {
        origin: '*',
        methods: 'POST,GET,PUT,DELETE',
        allowedHeaders: 'X-Requested-With,Content-Type,Authorization'
    };

app.use(cors(corsOptions));

// Starting the auth service
app.use(passport.initialize());

app.use(token(authorization.secret));

var router = express.Router();
router.use(function (req, res, next) {
    logger.info('%s %s %s', req.method, req.url, req.path);
    next(); //!important
});
require('./routes/index.js')(router);

app.use(bodyParser());

// all requests to this router will first hit this middleware
app.use('/api/', router);

// START THE SERVER
// =============================================================================
app.listen(port);


console.log('Server Listening at ' + port + ' port');


