const {fakeMarkers} = require("./fakeData");
var hrs = Array(512).fill(0);
var edas = Array(512).fill(0);

const axios = require('axios');

const url = "http://193.166.24.186:8003/predict";

const getBioMarker = async (req, res) => {
    const { index } = req.body;
    try {
        console.log(index);
        console.log('getBioMarker');
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
            const eda = testData.data.map(pair => pair[1]*1.5);
            edas = edas.concat(eda);
            edas = edas.slice(-512);
          })
          .catch(error => {
            console.error(error);
          });
        console.log('plux_processed_eda');

        axios.get('http://172.22.8.62:8000/stream/plux_processed_ppg', {
            params: {
              limit: 500
            },
            headers: {
              'Accept': 'application/json'
            }
          })
          .then(res1 => {
            const testData = res1.data;
            const hr = testData.data.map(pair => pair[2]);
            hrs = hrs.concat(hr);
            hrs = hrs.slice(-512);
            const params = {
                "empatica": [
                  [Array(512).fill(0), Array(512).fill(0), Array(512).fill(0), Array(512).fill(0), hrs, edas, Array(512).fill(0)]
                ]
              };
            console.log('plux_processed_ppg');
            axios.post(url, params)
            .then(response => {
                // Replace all single quotes with double quotes
                resData = response.data.replace(/"/g, '').replace(/'/g, '"');
                const d = JSON.parse(resData);
                res.status(200).json(d);
                console.log(d);
                //res.status(200).json({'stress':fakeMarkers[index]['stress'],'mental_workload':fakeMarkers[index]['mental_workload']});
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
