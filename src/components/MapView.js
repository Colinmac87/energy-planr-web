import { Add, Remove } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import React, { useRef, useMemo, useEffect, useState } from "react";

const SCROLL_SENSITIVITY = 0.0005;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;

const MapView = ({ image, data, arePinsVisible }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);

  const touch = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const observer = useRef(null);
  const background = useMemo(() => new Image(), [image]);

  useEffect(() => {
    observer.current = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
        if (canvasRef.current) {
          entries.forEach(({ target }) => {
            const { width, height } = background;
            // If width of the container is smaller than image, scale image down
            if (target.clientWidth < width) {
              // Calculate scale
              const scale = target.clientWidth / width;

              // Redraw image
              canvasRef.current.width = width * scale;
              canvasRef.current.height = height * scale;
              canvasRef.current
                .getContext("2d")
                .drawImage(background, 0, 0, width * scale, height * scale);
              if (arePinsVisible) drawPins();
            }
          });
        }
      });
    });
    observer.current.observe(containerRef.current);

    canvasRef.current.addEventListener(
      "click",
      function () {
        console.log("CLICKED");
      },
      false
    );

    return () => {
      if (containerRef.current)
        observer.current.unobserve(containerRef.current);
    };
  }, []);

  useEffect(() => {
    background.src = image;

    if (canvasRef.current) {
      background.onload = () => {
        // Get the image dimensions
        const { width, height } = background;
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        // Set image as background
        canvasRef.current.getContext("2d").drawImage(background, 0, 0);
        if (arePinsVisible) drawPins();
      };
    }
  }, [background]);

  useEffect(() => {
    drawBackground();
    if (arePinsVisible) drawPins();
  }, [zoom, offset, arePinsVisible]);

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  const onZoomIn = () => {
    if (!dragging) {
      setZoom((zoom) =>
        clamp(zoom - 125 * SCROLL_SENSITIVITY * -1, MIN_ZOOM, MAX_ZOOM)
      );
    }
  };

  const onZoomOut = () => {
    if (!dragging) {
      setZoom((zoom) =>
        clamp(zoom + 125 * SCROLL_SENSITIVITY * -1, MIN_ZOOM, MAX_ZOOM)
      );
    }
  };

  const onMouseWheel = (e) => {
    if (!dragging) {
      setZoom((zoom) =>
        clamp(zoom + e.deltaY * SCROLL_SENSITIVITY * -1, MIN_ZOOM, MAX_ZOOM)
      );
    }
  };

  const onMouseMove = (event) => {
    if (dragging) {
      const { x, y } = touch.current;
      const { clientX, clientY } = event;
      setOffset({
        x: offset.x + (x - clientX),
        y: offset.y + (y - clientY),
      });
      touch.current = { x: clientX, y: clientY };
    }
  };

  const onMouseDown = (event) => {
    const { clientX, clientY } = event;
    touch.current = { x: clientX, y: clientY };
    setDragging(true);
  };

  const onMouseUp = () => setDragging(false);

  const drawBackground = () => {
    if (canvasRef.current) {
      const { width, height } = canvasRef.current;
      const context = canvasRef.current.getContext("2d");

      // Set canvas dimensions
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      // Clear canvas and scale it
      context.translate(-offset.x, -offset.y);
      context.scale(zoom, zoom);
      context.clearRect(0, 0, width, height);

      // Make sure we're zooming to the center
      const x = (context.canvas.width / zoom - background.width) / 2;
      const y = (context.canvas.height / zoom - background.height) / 2;

      // Draw image
      context.drawImage(background, x, y);
    }
  };

  const drawPins = () => {
    if (canvasRef.current) {
      const drawCircle = (ctx, x, y, radius, fill, stroke, strokeWidth) => {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        if (fill) {
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (stroke) {
          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = stroke;
          ctx.stroke();
        }
      };

      const { width, height } = canvasRef.current;
      const context = canvasRef.current.getContext("2d");

      data.forEach((dataPin) =>
        drawCircle(
          context,
          dataPin.x * 10,
          dataPin.y * 10,
          10,
          "blue",
          "blue",
          2
        )
      );
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff2",
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onWheel={onMouseWheel}
      />
      {/* <Box sx={{ position: "absolute", top: 12, right: 12 }}>
        <Button
          key="btnMapDownload"
          size="small"
          variant="contained"
          sx={{ backgroundColor: "black", color: "white" }}
        >
          <Download />
        </Button>
      </Box>
      <Box sx={{ position: "absolute", bottom: 12, left: 12 }}>
        <Button
          key="btnTooglePinsVisibilitiy"
          onClick={onTogglePinsVisibility}
          size="small"
          variant="contained"
          sx={{ backgroundColor: "black", color: "white" }}
        >
          {arePinsVisible ? <Visibility /> : <VisibilityOff />}
        </Button>
      </Box> */}
      <Box sx={{ position: "absolute", bottom: 12, right: 12 }}>
        <Stack direction={"column"} spacing={0.5}>
          <Button
            key="btnZoomIn"
            onClick={onZoomIn}
            size="small"
            variant="contained"
            sx={{ backgroundColor: "black", color: "white" }}
          >
            <Add />
          </Button>
          <Button
            key="btnZoomOut"
            onClick={onZoomOut}
            size="small"
            variant="contained"
            sx={{ backgroundColor: "black", color: "white" }}
          >
            <Remove />
          </Button>
        </Stack>
      </Box>
    </div>
  );
};

export default MapView;
