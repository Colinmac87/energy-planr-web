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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import EquipmentDataForm from "./EquipmentDataForm";
import { v4 } from "uuid";
import WithDataField from "./dataUI/WithDataField";
import { useSelector } from "react-redux";
import { Add, UploadFile } from "@mui/icons-material";
import EquipmentFileUpload from "./EquipmentFileUpload";
import { getDataByRegister } from "../services/data.service";

const AssetRegisterView = ({ onDataSelect }) => {
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
    if (register) loadData();
  }, [register]);

  const loadData = () => {
    getDataByRegister(register.id).then((_data) => {
      setData(_data);
    });
  };

  return (
    <Box sx={{ display: "flex", flex: 1, flexDirection: "column", p: 4 }}>
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
              value={register}
              label="Register"
              onChange={(e) => setRegister(e.target.value)}
            >
              {registers.map((r) => (
                <MenuItem value={r}>{r.name}</MenuItem>
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
              rows={data?.map((d, i) => ({
                id: v4(),
                ...d,
              }))}
              columns={
                register?.formFields
                  ? register?.formFields
                      ?.filter((field) => field.showInRegister)
                      .map((field) => ({
                        field: field.key,
                        headerName: field.name,
                        width: 200,
                        renderCell: ({ value }) => (
                          <WithDataField
                            field={field}
                            value={value}
                            withLabel={false}
                          />
                        ),
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
        isOpen={isFileUploadDialogOpen}
        onClose={() => setIsFileUploadDialogOpen(false)}
        onSave={() => {}}
      />
    </Box>
  );
};

export default AssetRegisterView;
