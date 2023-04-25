import {
  Box,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import EquipmentDataForm from "./EquipmentDataForm";
import { Link } from "react-router-dom";
import { v4 } from "uuid";

const AssetRegisterView = ({ data }) => {
  const [isEquipmentDetailViewerOpen, setIsEquipmentDetailViewerOpen] =
    useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const columns = [
    {
      field: "equipmentNo",
      headerName: "Equipment No",
      width: 200,
    },
    {
      field: "location",
      headerName: "Location",
      width: 150,
    },
    {
      field: "level",
      headerName: "Level",
      width: 150,
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
    },
    {
      field: "runStatus",
      headerName: "Run Status",
      width: 150,
    },
  ];

  const onCloseEquipmentDetailViewer = () => {
    setIsEquipmentDetailViewerOpen(false);
  };

  return (
    <Grid container spacing={2}>
      {/* <Grid item md={4}>
        <TextField
          id={`register-search`}
          label={"Search"}
          // variant="filled"
          fullWidth
          // InputProps={{
          //   readOnly: true,
          // }}
          // value={formData[field.fieldTag]}
          // onChange={(e, v) => {
          //   const temp = JSON.parse(JSON.stringify(formData));
          //   temp[field.fieldTag] = e.target.value;
          //   setFormData(temp);
          // }}
        />
      </Grid>
      <Grid item md={4}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Level</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Level"
          >
            <MenuItem value={10}>Mezz Floor</MenuItem>
            <MenuItem value={20}>Lower Deck</MenuItem>
            <MenuItem value={30}>Roof Deck</MenuItem>
          </Select>
        </FormControl>
      </Grid> */}
      <Grid item xs={12}>
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={data.map((d, i) => ({
              id: v4(),
              ...d,
            }))}
            columns={columns}
            pageSizeOptions={[5, 20, 50, 100]}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
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
