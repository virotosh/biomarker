const {fakeMarkers} = require("./fakeData");

const getBioMarker = async (req, res) => {
    const { index } = req.body;
    try {
        res.status(200).json(fakeMarkers[index]);
    } catch (error) {

    }
};

const getDefault = async (req, res) => {
    try {
        res.status(200).json({ message: "success" });
    } catch (error) {

    }
};

module.exports = {
    getBioMarker,
    getDefault,
};
