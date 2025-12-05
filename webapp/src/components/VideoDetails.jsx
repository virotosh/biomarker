import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Card, CardContent, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios"

const VideoDetails = () => {
    const playerRef = useRef();
    const [index, setIndex] = useState(0);
    const [physio, setPhysio] = useState({});

    const getData = async(e) => {
      try {
        const res = await axios.post(
            "http://localhost:5000/api/physio",
            { index: e }
        );
        if (res.status === 200) {
          setPhysio(res.data)
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
          </Box>
        </Box>
        <Box
          px={2}
          py={{ md: 1, xs: 5 }}
          justifyContent="center"
          alignItems="center"
        >
            <Card
                sx={{
                width: { xs: "100%", sm: "358px", md: "320px" },
                boxShadow: "none",
                borderRadius: 0,
                maxWidth: "358px",
                }}>
                <CardContent sx={{ backgroundColor: "#1E1E1E", height: "320px" }}>
                    {Object.entries(physio).map(([key, value]) => (
                      <Typography fontWeight="bold" color={value>0.6? (value>0.8 ? "#F84F31":"#FF980E"):"#069C56"}>
                        {key} : {value}
                      </Typography>
                    ))}
              </CardContent>
            </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetails;