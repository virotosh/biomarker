import React, { useEffect, useState } from "react";
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

const VideoDetails = () => {
  const [index, setIndex] = useState(0);
  const [physio, setPhysio] = useState({});
  const [physiotmp, setPhysiotmp] = useState(Array.from({ length: 50 }, () => ({ stress: 0.0, mental_workload: 0.0 })));
  const [frameUrl, setFrameUrl] = useState(""); // store object URL for img

  // Poll physio as before (no change)
  const getData = async (e) => {
    try {
      const res = await axios.post(
        "http://193.166.24.186:5000/api/physio",
        { index: e }
      );
      if (res.status === 200) {
        setPhysio(res.data);
        setPhysiotmp(prev => {
          const updated = [...prev, res.data];
          return updated.slice(-50);
        });
        // console.log(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getData(0);
  }, []);

  // 1s polling for frame
  useEffect(() => {
    let isMounted = true;
    let timer;
    let lastObjectUrl = null;

    const fetchFrame = async () => {
      try {
        const res = await axios.get("http://172.22.8.62:8000/stream/video_display1/frame", {
          responseType: "blob",
          headers: {
            // Optionally, you can add cache busting:
            // 'Cache-Control': 'no-cache'
          },
        });
        if(!isMounted) return;
        // Create blob URL
        const objectUrl = URL.createObjectURL(res.data);

        setFrameUrl(objectUrl);

        // Clean up old blob url
        if (lastObjectUrl) {
          URL.revokeObjectURL(lastObjectUrl);
        }
        lastObjectUrl = objectUrl;

        getData(0);
      } catch (err) {
        // Could add retry logic here if needed
        // Optionally clear image on error:
        setFrameUrl("");
        console.error("Frame fetch error", err);
      }
      timer = setTimeout(fetchFrame, 200);
    };
    fetchFrame();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
      if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
    };
  }, []);

  const chartData = {
    labels: physiotmp.map((_, i) => i),
    datasets: [
      {
        label: "Stress",
        data: physiotmp.map(item => item.stress),
        borderColor: "#FFD700",
        backgroundColor: "rgba(255, 215, 0, 0.3)",
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
                width: "100%",       // scale with window width
                height: "auto",      // keep aspect ratio
                display: "block",
                objectFit: "contain", // do not crop, just fit
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