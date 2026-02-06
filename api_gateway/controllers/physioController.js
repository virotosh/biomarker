const {fakeMarkers} = require("./fakeData");
var hrs = [0];
var edas = [0]

const axios = require('axios');

const url = "http://193.166.24.186:8003/predict";

const getBioMarker = async (req, res) => {
    const { index } = req.body;
    try {

        axios.get('http://172.22.8.62:8000/stream/plux_processed_eda', {
            params: {
              limit: 500
            },
            headers: {
              'Accept': 'application/json'
            }
          })
          .then(res1 => {
            const testData = res1.data;
            const eda = testData.data.map(pair => pair[0]/10000);
            const hr = testData.data.map(pair => pair[1]);
            hrs = hrs.concat(hr);
            hrs = hrs.slice(-512);
            edas = edas.concat(eda);
            edas = edas.slice(-512);
            const params = {
                "empatica": [
                  [Array(512).fill(0), Array(512).fill(0), Array(512).fill(0), Array(512).fill(0), hrs, edas, Array(512).fill(0)]
                ]
              };
            //console.log(params['empatica'][0][4].length);
            axios.post(url, params)
            .then(response => {
                // Replace all single quotes with double quotes
                resData = response.data.replace(/"/g, '').replace(/'/g, '"');
                const d = JSON.parse(resData);
                console.log(response.data);
                res.status(200).json(d);
            })
            .catch(error => {
                console.error('Error:', error);
            });

          })
          .catch(error => {
            console.error(error);
          });

        
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
