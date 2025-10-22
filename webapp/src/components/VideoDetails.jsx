import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Card, CardContent, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const VideoDetails = () => {
    const playerRef = useRef();
    const [played, setPlayed] = useState(0);
    const handleTimeUpdate = (e) => {
        setPlayed(playerRef.current.api.getCurrentTime());
        //console.log(playerRef.current.api.getCurrentTime());
        //console.log('onProgress');
      };
  return (
    <Box minHeight="95vh">
      <Stack direction="row">
        <Box flex={1}>
          <Box sx={{ width: "100%", position: "sticky", top: "86px" }}>
            <ReactPlayer
                ref={playerRef}
                onTimeUpdate={handleTimeUpdate}
                src="https://www.youtube.com/watch?v=TKQpky1hEw0"
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
                    <Typography fontWeight="bold" color="#FFF">
                        {played}
                    </Typography>
                    <Typography fontWeight="bold" color="#FFF">
                        bbb
                    </Typography>
              </CardContent>
            </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetails;