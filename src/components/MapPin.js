import { Box, Drawer, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import EquipmentDataForm from "./EquipmentDataForm";

const MapPin = ({ data, x, y }) => {
  const [isEquipmentDetailViewerOpen, setIsEquipmentDetailViewerOpen] =
    useState(false);

  const hoverTooltipContent = () => {
    return (
      <Box>
        <Typography variant="body1">{data?.equipmentNo}</Typography>
        <Typography variant="caption">Click to view detail</Typography>
      </Box>
    );
  };

  return (
    <>
      <Tooltip title={hoverTooltipContent()} placement="top">
        <span
          onClick={() => setIsEquipmentDetailViewerOpen(true)}
          style={{
            position: "absolute",
            top: `${y}%`,
            left: `${x}%`,
            width: 16,
            height: 16,
            background: "blue",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0px 0px 2px 3px #0002",
          }}
        ></span>
      </Tooltip>

      <Drawer
        anchor={"bottom"}
        open={isEquipmentDetailViewerOpen}
        onClose={() => setIsEquipmentDetailViewerOpen(false)}
        sx={{ maxHeight: window.outerHeight - 100 }}
      >
        <Box sx={{ p: 4 }}>
          <EquipmentDataForm data={data} />
        </Box>
      </Drawer>
    </>
  );
};

export default MapPin;
