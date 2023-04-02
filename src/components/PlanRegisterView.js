import { Box, Drawer } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import EquipmentDataForm from "./EquipmentDataForm";

const PlanRegisterView = ({ data }) => {
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
  ];

  const onCloseEquipmentDetailViewer = () => {
    setIsEquipmentDetailViewerOpen(false);
  };

  return (
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

      <Drawer
        anchor={"bottom"}
        open={isEquipmentDetailViewerOpen}
        onClose={onCloseEquipmentDetailViewer}
        sx={{ maxHeight: window.outerHeight - 100 }}
      >
        <Box sx={{ p: 4 }}>
          <EquipmentDataForm data={selectedData} />
        </Box>
      </Drawer>
    </Box>
  );
};

export default PlanRegisterView;
