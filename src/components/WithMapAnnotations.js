import { useState } from "react";
import { saveAnnotations } from "../services/location.service";
import MapView from "./MapView";
import { Box, Drawer, useTheme } from "@mui/material";
import EquipmentDataForm from "./EquipmentDataForm";
import { useSelector } from "react-redux";

const WithMapAnnotations = ({
  mode,
  location,
  data,
  isArialViewVisible,
  areAnnotationsVisible,
  arePinsVisible,
  onPinPlacement,
}) => {
  const theme = useTheme();
  const { registers } = useSelector((state) => state.asset);

  const [selectedDataRegister, setSelectedDataRegister] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isEquipmentDetailViewerOpen, setIsEquipmentDetailViewerOpen] =
    useState(false);

  const handleSaveAnnotations = (annotations) => {
    saveAnnotations(location.id, annotations);
  };

  const handleExpandPin = (dataPoint) => {
    setSelectedData(dataPoint);
    setSelectedDataRegister(
      registers.find((r) => r.id == dataPoint.xRegisterId)
    );
    setIsEquipmentDetailViewerOpen(true);
  };

  return (
    <>
      <MapView
        mode={mode || "view"}
        data={data}
        image={location.backgroundMapUrl}
        defaultZoomPercentage={location.defaultZoomPercentage || 10}
        initialAnnotations={location.annotations?.map((annotation) => ({
          ...annotation,
          coords: JSON.parse(annotation.coords),
        }))}
        isArialViewVisible={isArialViewVisible}
        areAnnotationsVisible={areAnnotationsVisible}
        arePinsVisible={arePinsVisible}
        onPinPlacement={onPinPlacement}
        onSaveAnnotations={handleSaveAnnotations}
        onExpandPin={handleExpandPin}
      />

      <Drawer
        anchor={"bottom"}
        open={isEquipmentDetailViewerOpen}
        onClose={() => {
          setIsEquipmentDetailViewerOpen(false);
          setSelectedData(null);
        }}
        sx={{
          maxHeight: window.outerHeight - 100,
          zIndex: 1400,
        }}
      >
        <Box
          sx={{
            height: "100%",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <EquipmentDataForm
            register={selectedDataRegister}
            data={selectedData}
            onSaving={() => {}}
            onSave={() => {
              setIsEquipmentDetailViewerOpen(false);
              setSelectedData(null);
            }}
            onClose={() => {
              setIsEquipmentDetailViewerOpen(false);
              setSelectedData(null);
            }}
          />
        </Box>
      </Drawer>
    </>
  );
};

export default WithMapAnnotations;
