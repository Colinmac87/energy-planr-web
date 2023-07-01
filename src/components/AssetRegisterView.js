import {
  Box,
  Button,
  Drawer,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import EquipmentDataForm from "./EquipmentDataForm";

import WithDataField from "./dataUI/WithDataField";
import { useSelector } from "react-redux";
import { Add, UploadFile } from "@mui/icons-material";
import EquipmentFileUpload from "./EquipmentFileUpload";
import { getDataByRegister, updateDataValue } from "../services/data.service";
import { muiDataGridCellEditProps } from "../utils/form.utils";
import WithCellTriggerEffect from "./dataUI/WithCellTriggerEffect";
import { useSnackbar } from "notistack";

const AssetRegisterView = ({ onDataSelect }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const gridApiRef = useGridApiRef();
  const { registers } = useSelector((state) => state.asset);

  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isEquipmentDetailViewerOpen, setIsEquipmentDetailViewerOpen] =
    useState(false);

  const [register, setRegister] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [data, setData] = useState([]);

  const onCloseEquipmentDetailViewer = () => {
    setSelectedData(null);
    setIsEquipmentDetailViewerOpen(false);
  };

  useEffect(() => {
    if (registers && registers.length > 0) {
      try {
        setRegister(registers[0]);
      } catch (error) {}
    }
  }, [registers]);

  useEffect(() => {
    if (register) loadData();
  }, [register]);

  const loadData = () => {
    getDataByRegister(register.id).then((_data) => {
      setData(_data);
    });
  };

  const onCellEdit = (id, field, value) => {
    updateDataValue(id, field, value).then(() => {
      enqueueSnackbar("Changes saved", { variant: "success" });
    });
  };

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        flexGrow: 1,
        m: 0,
        p: 2,
        position: "relative",
        overflow: "auto",
      }}
    >
      <Stack
        spacing={2}
        direction={"row"}
        justifyContent={"space-between"}
        mb={2}
      >
        <Stack sx={{ flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Register</InputLabel>
            <Select
              autoFocus
              value={register?.id}
              label="Register"
              onChange={(e) => {
                setRegister(registers.find((r) => r.id == e.target.value));
              }}
            >
              {registers?.map((r) => (
                <MenuItem value={r.id}>{r.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack
          spacing={2}
          direction={"row"}
          mb={2}
          sx={{ flex: 1 }}
          justifyContent={"flex-end"}
        >
          <Button
            disabled={register == null}
            variant="outlined"
            component="label"
            startIcon={<UploadFile />}
            onClick={() => setIsFileUploadDialogOpen(true)}
          >
            Upload Data
          </Button>
          <Button
            disabled={register == null}
            variant="contained"
            component="label"
            startIcon={<Add />}
            onClick={() => {
              setSelectedData(null);
              setIsEquipmentDetailViewerOpen(true);
            }}
          >
            New Record
          </Button>
        </Stack>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              sx={{
                "& .MuiDataGrid-cell": {
                  padding: 0,
                },
              }}
              apiRef={gridApiRef}
              rows={data}
              columns={
                register?.formFields
                  ? register?.formFields
                      ?.filter((field) => field.showInRegister)
                      .map((field) => ({
                        field: field.key,
                        headerName: field.name,
                        width: 200,
                        ...muiDataGridCellEditProps(field.type),
                        renderCell: ({ value }) => (
                          <WithCellTriggerEffect field={field} value={value}>
                            <WithDataField
                              field={field}
                              value={value}
                              withLabel={false}
                            />
                          </WithCellTriggerEffect>
                        ),
                      }))
                  : []
              }
              onCellEditStop={(params, event, details) => {
                if (event.key == "Enter")
                  onCellEdit(params.id, params.field, event.target.value);
              }}
              pageSizeOptions={[5, 20, 50, 100]}
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbar }}
              onRowDoubleClick={(params) => {
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
            <Box
              sx={{
                p: 4,
                height: "100%",
                backgroundColor: theme.palette.background.default,
              }}
            >
              <EquipmentDataForm
                register={register}
                data={selectedData}
                onSaving={() => {}}
                onSave={loadData}
                onClose={onCloseEquipmentDetailViewer}
              />
            </Box>
          </Drawer>
        </Grid>
      </Grid>

      <EquipmentFileUpload
        register={register}
        isOpen={isFileUploadDialogOpen}
        onClose={() => setIsFileUploadDialogOpen(false)}
        onSave={loadData}
      />
    </Box>
  );
};

export default AssetRegisterView;
