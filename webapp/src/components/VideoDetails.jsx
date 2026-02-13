import React, { useEffect, useState, useRef } from "react";
import { Typography, Box, Card, CardContent, Stack } from "@mui/material";
import axios from "axios";
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

const PHYSIO_API_URL = process.env.REACT_APP_PHYSIO_API_URL;
const FRAME_API_URL = process.env.REACT_APP_FRAME_API_URL;

const VideoDetails = () => {
  const [physio, setPhysio] = useState(Array.from({ length: 50 }, () => ({ stress: 0.0, mental_workload: 0.0 })));
  const [frameUrl, setFrameUrl] = useState(""); // store object URL for img
  const lastFrameObjectUrl = useRef(null);

  // PHYSIO: 1000ms polling
  useEffect(() => {
    let isMounted = true;
    let index = 0;
    const getData = async () => {
      try {
        const res = await axios.post(PHYSIO_API_URL, { index: index++ });
        if (!isMounted) return;
        if (res.status === 200) {
          setPhysio(prev => {
            const updated = [...prev, res.data];
            return updated.slice(-50);
          });
        }
      } catch (err) {
        console.error("Physio fetch error", err);
      }
    };
    // First call
    getData();
    const interval = setInterval(getData, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // FRAME: 100ms polling
  useEffect(() => {
    let isMounted = true;
    let timerId;
    const fetchFrame = async () => {
      try {
        const res = await axios.get(FRAME_API_URL, {
          responseType: "blob",
        });
        if (!isMounted) return;

        const objectUrl = URL.createObjectURL(res.data);
        setFrameUrl(objectUrl);

        // Clean up old URL
        if (lastFrameObjectUrl.current) {
          URL.revokeObjectURL(lastFrameObjectUrl.current);
        }
        lastFrameObjectUrl.current = objectUrl;
      } catch (err) {
        setFrameUrl("");
        console.error("Frame fetch error", err);
      }
      // Schedule next fetch
      timerId = setTimeout(fetchFrame, 100);
    };

    fetchFrame();
    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
      if (lastFrameObjectUrl.current) URL.revokeObjectURL(lastFrameObjectUrl.current);
    };
  }, []);

  const chartData = {
    labels: physio.map((_, i) => i),
    datasets: [
      {
        label: "Stress",
        data: physio.map(item => item.stress),
        borderColor: "#FFD700",
        backgroundColor: "rgba(255, 215, 0, 0.3)",
        tension: 0.3,
        pointRadius: 0,
        fill: false
      },
      {
        label: "Mental Workload",
        data: physio.map(item => item.mental_workload),
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
    animation: false,
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
            {/* Replace ReactPlayer with updating img */}
            <img
              src={frameUrl}
              alt="Live Frame"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "contain",
                background: "#111",
              }}
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