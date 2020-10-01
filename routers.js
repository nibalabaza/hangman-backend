const { Router } = require("express");
const router = Router();
const UserController = require('./controllers/user');
const RoomController = require('./controllers/room'); 
const cryptoRandomString = require("crypto-random-string"); 
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.get('/verify/:code', UserController.verify);


function UserLoggedIn (req, res, next) {
    if (req.user) {
        return next();
    }
    res.statusCode = (403); 
    next('NOT AUTHORIZED');
}

router.post("/room",  RoomController.create );


router.get('/pro', UserLoggedIn, (req, res) => {

    res.send(req.user);
});

module.exports = router;



