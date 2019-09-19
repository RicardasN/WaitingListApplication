module.exports = {
    userMiddleware: async function (req, res, next) {
        res.locals.currentUser = req.user;
        next();
    }
}