import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import EquipmentDataForm from "./EquipmentDataForm";

import WithDataField from "./dataUI/WithDataField";
import { useSelector } from "react-redux";
import {
  Add,
  Archive,
  Delete,
  Edit,
  MoreHoriz,
  Place,
  Unarchive,
  UploadFile,
} from "@mui/icons-material";
import Papa from "papaparse";
import EquipmentFileUpload from "./EquipmentFileUpload";
import {
  archiveData,
  deleteData,
  getDataByRegister,
  unarchiveData,
  updateDataValue,
} from "../services/data.service";
import {
  isFieldUploadParsable,
  isInternalField,
  muiDataGridCellEditProps,
} from "../utils/form.utils";
import WithCellTriggerEffect from "./dataUI/WithCellTriggerEffect";
import { useSnackbar } from "notistack";
import { MaterialReactTable } from "material-react-table";
import { LoadingButton } from "@mui/lab";
import { fromSecs } from "../utils/date.utils";

const AssetRegisterView = ({ onDataSelect }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { asset, registers } = useSelector((state) => state.asset);

  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [isEquipmentDetailViewerOpen, setIsEquipmentDetailViewerOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [loading, setLoading] = useState(true);
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
        setRegister(registers.find((r) => r.isDefault) || registers[0]);
      } catch (error) {}
    }
  }, [registers]);

  useEffect(() => {
    if (register) loadData();
  }, [register]);

  const loadData = () => {
    getDataByRegister(register.id)
      .then((_data) => {
        setData(_data);
      })
      .finally(() => setLoading(false));
  };

  const onCellEdit = (id, field, value) => {
    updateDataValue(id, field, value).then(() => {
      enqueueSnackbar("Changes saved", { variant: "success" });
    });
  };

  const handleExportRows = (rows) => {
    const csv = Papa.unparse(
      rows.map((row) => {
        const rowObj = { ...row.original };
        for (const key in rowObj) {
          if (Object.hasOwnProperty.call(rowObj, key) && isInternalField(key)) {
            delete rowObj[key];
          }
        }
        return rowObj;
      }),
      {
        fields: register?.formFields
          .filter((field) => isFieldUploadParsable(field))
          .map((field) => field.name),
      }
    );

    const blob = new Blob([csv]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob, { type: "text/csv" });
    a.download = `${asset.name} - ${register.name}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = () => {
    setLoading(true);
    deleteData(selectedData.id)
      .then(() => {
        loadData();
        enqueueSnackbar("Record deleted", { variant: "info" });
      })
      .finally(() => {
        setSelectedData(null);
        setIsDeleteDialogOpen(false);
        setLoading(false);
      });
  };

  const handleArchive = (id) => {
    archiveData(id).then(() => {
      enqueueSnackbar("Record archived", { variant: "success" });
      loadData();
    });
  };

  const handleUnarchive = (id) => {
    unarchiveData(id).then(() => {
      enqueueSnackbar("Record restored", { variant: "success" });
      loadData();
    });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
        overflow: "hidden",
      }}
    >
      <Stack
        spacing={2}
        direction={"row"}
        justifyContent={"space-between"}
        mb={2}
      >
        <Stack sx={{ flex: 1 }}>
          {register?.id && (
            <FormControl fullWidth>
              <InputLabel>Register</InputLabel>
              <Select
                label="Register"
                value={register.id}
                onChange={(e) => {
                  setRegister(registers.find((r) => r.id == e.target.value));
                }}
              >
                {registers?.map((r) => (
                  <MenuItem value={r.id}>{r.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>
        <Stack
          spacing={2}
          direction={"row"}
          mb={2}
          sx={{ flex: 3 }}
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
      <Box
        sx={{
          m: 0,
          p: 0,
          overflowY: "hidden",
        }}
      >
        <MaterialReactTable
          enableRowNumbers
          displayColumnDefOptions={{ "mrt-row-actions": { size: 180 } }}
          enableRowSelection
          enableMultiRowSelection
          renderTopToolbarCustomActions={({ table }) => (
            <Stack sx={{ flexDirection: "row", gap: 2 }}>
              <Button
                variant="outlined"
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                onClick={() =>
                  handleExportRows(table.getPrePaginationRowModel().rows)
                }
              >
                Export All Rows
              </Button>
              <Button
                variant="outlined"
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() =>
                  handleExportRows(table.getSelectedRowModel().rows)
                }
              >
                Export Selected Rows
              </Button>
            </Stack>
          )}
          enableRowActions
          renderRowActions={({ cell, row }) => (
            <Stack sx={{ flex: 1, alignItems: "center" }}>
              {row.original.xIsArchived ? (
                <Stack
                  sx={{ flexDirection: "row", gap: 2, alignItems: "center" }}
                >
                  <Tooltip title="Restore">
                    <IconButton
                      edge="end"
                      aria-label="unarchive"
                      onClick={() => {
                        handleUnarchive(row.original.id);
                      }}
                    >
                      <Unarchive />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ) : (
                <Stack sx={{ flexDirection: "row", gap: 2 }}>
                  <Tooltip title="Edit">
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => {
                        setSelectedData(row.original);
                        setIsEquipmentDetailViewerOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setSelectedData(row.original);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Archive">
                    <IconButton
                      edge="end"
                      aria-label="archive"
                      onClick={() => {
                        handleArchive(row.original.id);
                      }}
                    >
                      <Archive />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Pin Placement">
                    <IconButton edge="end" aria-label="pin" onClick={() => {}}>
                      <Place />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
              <Tooltip
                title={
                  row.original.xIsArchived
                    ? "Archived"
                    : row.original.xUpdatedBy
                    ? "Last Modified"
                    : "Created"
                }
                placement="top"
              >
                <Typography variant="caption" sx={{ textAlign: "center" }}>
                  {row.original.xArchivedBy?.fullName ||
                    row.original.xUpdatedBy?.fullName ||
                    row.original.xCreatedBy?.fullName}
                  ,{" "}
                  {fromSecs(
                    row.original.xArchivedAt?.seconds ||
                      row.original.xUpdatedAt?.seconds ||
                      row.original.xCreatedAt?.seconds
                  )
                    .toLocaleString()
                    .replace(",", "")
                    .slice(0, 16)}
                </Typography>
              </Tooltip>
            </Stack>
          )}
          data={data}
          columns={
            register?.formFields
              ? register?.formFields
                  ?.filter((field) => field.showInRegister)
                  .map((field) => ({
                    accessorKey: field.key,
                    header: field.name,
                    size: 200,
                    ...muiDataGridCellEditProps(field.type),
                    Cell: ({ renderedCellValue, row }) => (
                      <WithCellTriggerEffect
                        field={field}
                        value={renderedCellValue}
                      >
                        <WithDataField
                          field={field}
                          value={renderedCellValue}
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
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          onRowDoubleClick={(params) => {
            setSelectedData(params.row);
            setIsEquipmentDetailViewerOpen(true);
          }}
          enablePagination={false}
          enableRowVirtualization
          state={{ isLoading: loading }}
          enableColumnResizing={true}
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
            height: "100%",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <EquipmentDataForm
            register={register}
            data={selectedData}
            onSaving={() => {}}
            onSave={() => {
              loadData();
              onCloseEquipmentDetailViewer();
            }}
            onClose={onCloseEquipmentDetailViewer}
          />
        </Box>
      </Drawer>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Are you sure you want to delete this data permanently?
        </DialogTitle>
        <DialogActions>
          <Button
            disabled={loading}
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <LoadingButton loading={loading} onClick={handleDelete} color="error">
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>

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
