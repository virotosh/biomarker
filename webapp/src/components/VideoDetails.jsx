import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactPlayer from "react-player";
import { Typography, Box, Card, CardContent, Stack } from "@mui/material";
import axios from "axios"

import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend
);

const VideoDetails = () => {
    const playerRef = useRef();
    const [index, setIndex] = useState(0);
    const [physio, setPhysio] = useState({});
    const [physiotmp, setPhysiotmp] = useState(Array.from({ length: 50 }, () => ({ stress: 0.0, mental_workload: 0.0 })));
    const getData = async(e) => {
      try {
        const res = await axios.post(
            "http://localhost:5000/api/physio",
            { index: e }
        );
        if (res.status === 200) {
          setPhysio(res.data)
          setPhysiotmp(prev => {
            const updated = [...prev, res.data];
            return updated.slice(-50);
          });
          console.log(res.data);
        }
      } catch (err) {
          console.error(err);
      }
    }
    useEffect(() => {
      getData(0);
    }, []);
    const handleTimeUpdate = (e) => {
        var _index = parseInt(playerRef.current.api.getCurrentTime()).toLocaleString();
        if (_index!=index){
          setIndex(_index);
          getData(_index);
        }
      };
    
      const chartData = {
        labels: physiotmp.map((_, i) => i),
        datasets: [
          {
            label: "Stress",
            data: physiotmp.map(item => item.stress),
            borderColor: "#FFD700",
            backgroundColor: "rgba(255, 215, 0, 0.3)", // Gold, semi-transparent fill if you set fill: true
            tension: 0.3,
            pointRadius: 0,
            fill: false
          },
          {
            label: "Mental Workload",
            data: physiotmp.map(item => item.mental_workload),
            borderColor: "#169C6B",
            backgroundColor: "#169C6B88",
            tension: 0.3,
            pointRadius: 0,
            fill: false
          }
        ]
      };
    
      const chartOptions = {
        responsive: true,
        plugins: {
          legend: { display: true, labels: { color: "#C9C9C9" } },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          x: {
            grid: { display: false, drawBorder: false },
            title: { display: false },
            ticks: { display: false }
          },
          y: {
            min: 0,
            max: 1,
            beginAtZero: true,
            title: {
              display: true,
              text: "Probability",
              color: "#C9C9C9"
            },
            ticks: { color: "#C9C9C9" }
          }
        }
      };
  return (
    <Box minHeight="95vh">
      <Stack direction="row">
        <Box flex={1}>
          <Box sx={{ width: "100%", position: "sticky", top: "86px" }}>
            <ReactPlayer
                ref={playerRef}
                onTimeUpdate={handleTimeUpdate}
                src="https://www.youtube.com/watch?v=BNOrliG3e-Y"
                className="react-player"
                controls
            />
            <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 320,
                  height: 180,
                  bgcolor: "rgba(30,30,30,0.75)",
                  borderRadius: 2,
                  boxShadow: 3,
                  zIndex: 2,
                  p: 1,
                  pointerEvents: "auto"
                }}
              >
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetails;