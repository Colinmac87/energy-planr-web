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
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import EquipmentDataForm from "./EquipmentDataForm";
import { Link } from "react-router-dom";

const AssetRegisterView = ({ data }) => {
  const [isEquipmentDetailViewerOpen, setIsEquipmentDetailViewerOpen] =
    useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const columns = [
    {
      field: "equipmentNo",
      headerName: "Equipment No",
      sortable: false,
      editable: false,
      filterable: false,
      width: 200,
    },
    {
      field: "location",
      headerName: "Location",
      sortable: false,
      editable: false,
      filterable: false,
      width: 150,
    },
    {
      field: "level",
      headerName: "Level",
      sortable: false,
      editable: false,
      filterable: false,
      width: 150,
    },
    {
      field: "type",
      headerName: "Type",
      sortable: false,
      editable: false,
      filterable: false,
      width: 150,
    },
    {
      field: "runStatus",
      headerName: "Run Status",
      sortable: false,
      editable: false,
      filterable: false,
      width: 150,
    },
    // {
    //   field: "id",
    //   headerName: "Action",
    //   sortable: false,
    //   editable: false,
    //   filterable: false,
    //   width: 150,
    //   valueGetter: (params) => {
    //     console.log(params);
    //     return <Link to={`/asset/maps/viewer/${params.id}`}>View Map</Link>;
    //   },
    // },
  ];

  const onCloseEquipmentDetailViewer = () => {
    setIsEquipmentDetailViewerOpen(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={4}>
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
          <InputLabel id="demo-simple-select-label">Location</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Location"
          >
            <MenuItem value={10}>Location 1</MenuItem>
            <MenuItem value={20}>Location 2</MenuItem>
            <MenuItem value={30}>Location 3</MenuItem>
          </Select>
        </FormControl>
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
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={data.map((d, i) => ({
              id: i,
              ...d,
            }))}
            columns={columns}
            // initialState={{
            //   pagination: {
            //     paginationModel: {
            //       pageSize: 5,
            //     },
            //   },
            // }}
            pageSizeOptions={[5, 20, 50, 100]}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnMenu
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
