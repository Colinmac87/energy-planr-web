import { Box, Drawer, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import EquipmentDataForm from "./EquipmentDataForm";
import { v4 } from "uuid";

const AssetRegisterView = ({ asset, data }) => {
  const [isEquipmentDetailViewerOpen, setIsEquipmentDetailViewerOpen] =
    useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const onCloseEquipmentDetailViewer = () => {
    setIsEquipmentDetailViewerOpen(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={data?.map((d, i) => ({
              id: v4(),
              ...d,
            }))}
            columns={
              asset?.formFields
                ? asset?.formFields?.map((field) => ({
                    field: field.key,
                    headerName: field.name,
                    width: 200,
                  }))
                : []
            }
            pageSizeOptions={[5, 20, 50, 100]}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            onRowClick={(params) => {
              setSelectedData(params.row);
              setIsEquipmentDetailViewerOpen(true);
            }}
          />
        </Box>

        <Drawer
          anchor={"bottom"}
          open={isEquipmentDetailViewerOpen}
          onClose={onCloseEquipmentDetailViewer}
          sx={{ maxHeight: window.outerHeight - 100 }}
        >
          <Box sx={{ p: 4 }}>
            <EquipmentDataForm
              asset={asset}
              data={selectedData}
              onClose={onCloseEquipmentDetailViewer}
            />
          </Box>
        </Drawer>
      </Grid>
    </Grid>
  );
};

export default AssetRegisterView;
