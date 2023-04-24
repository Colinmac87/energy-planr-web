import { Box, Drawer, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import EquipmentDataForm from "./EquipmentDataForm";

const MapPin = ({ data, x, y, isHighlighted, isHidden }) => {
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
        {isHighlighted ? (
          <span
            onClick={() => setIsEquipmentDetailViewerOpen(true)}
            onHo
            style={{
              position: "absolute",
              top: `${y}%`,
              left: `${x}%`,
              width: 18,
              height: 18,
              background: "red",
              borderRadius: "50%",
              cursor: "pointer",
              boxShadow: "0px 0px 2px 3px #0002",
              opacity: isHidden ? 0.5 : 1,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: `2px`,
                left: `2px`,
                width: 14,
                height: 14,
                background: "blue",
                borderRadius: "50%",
              }}
            ></span>
          </span>
        ) : (
          <span
            onClick={() => setIsEquipmentDetailViewerOpen(true)}
            style={{
              position: "absolute",
              top: `${y}%`,
              left: `${x}%`,
              width: 14,
              height: 14,
              background: "blue",
              borderRadius: "50%",
              cursor: "pointer",
              boxShadow: "0px 0px 2px 3px #0002",
              opacity: isHidden ? 0.5 : 1,
            }}
          ></span>
        )}
      </Tooltip>

      <Drawer
        anchor={"bottom"}
        open={isEquipmentDetailViewerOpen}
        onClose={() => setIsEquipmentDetailViewerOpen(false)}
        sx={{ maxHeight: window.outerHeight - 100 }}
      >
        <Box sx={{ p: 4 }}>
          <EquipmentDataForm
            data={data}
            onClose={() => setIsEquipmentDetailViewerOpen(false)}
          />
        </Box>
      </Drawer>
    </>
  );
};

export default MapPin;
