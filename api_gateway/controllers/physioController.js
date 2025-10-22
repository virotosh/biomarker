
const fakeMarkers = [
    {stress:0.2, mental_load:0.0, attention: 0.0},
    {stress:0.3, mental_load:0.1, attention: 0.1},
    {stress:0.3, mental_load:0.1, attention: 0.2},
    {stress:0.4, mental_load:0.1, attention: 0.3},
    {stress:0.5, mental_load:0.2, attention: 0.4},
    {stress:0.2, mental_load:0.3, attention: 0.2},
    {stress:0.1, mental_load:0.1, attention: 0.1},
]

const getBioMarker = async (req, res) => {
    const { ts_index } = req.body;
    try {
        res.status(200).json(fakeMarkers[ts_index]);
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
