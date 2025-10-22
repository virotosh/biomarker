import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import VideoDetails from "./components/VideoDetails";

const App = () => {
  return (
    <Box sx={{ backgroundColor: "#000" }}>
      <Routes>
        <Route path="/" element={<VideoDetails />} />
      </Routes>
    </Box>
  );
};

export default App;