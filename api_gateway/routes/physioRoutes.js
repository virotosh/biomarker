const express = require("express");
const router = express.Router();

const {
    getBioMarker,
    getDefault,
 } = require("../controllers/physioController")


router.route("/").get(getDefault)
                .post(getBioMarker)

module.exports = router;