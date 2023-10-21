const jwt = require("jsonwebtoken");
const multer = require("multer");

//Authorized By Token
exports.logIn = (req, res, next) => {
        let { token } = req.headers;
        if (token) {
            jwt.verify(token, 'secret', (err, data) => {
                if (data) {
                    console.log("Authorized User", data);
                    next();
                } else {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied'
                    })
                }

            })

        }

    }
    // Showing Logs
exports.log = (req, res, next) => {
        console.log(req.body, "middleware");
        next();
    }
    //Multer for file Storage