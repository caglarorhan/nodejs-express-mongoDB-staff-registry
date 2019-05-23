
class logger{
    log(req, res,next) {
        console.log('Logging');
        next();
    }

    auth(req, res,next) {
        console.log('Authentication');
        next();
    }

}





module.exports = logger;
