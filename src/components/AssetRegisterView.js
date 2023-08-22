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
  ListItemIcon,
  ListItemText,
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
  const [showingArchivedData, setShowingArchivedData] = useState(false);
  const [editingTable, setEditingTable] = useState(false);
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

  const renderRowActions = () => {
    if (showingArchivedData)
      return {
        renderRowActionMenuItems: null,
        renderRowActions: ({ cell, row }) => (
          <Stack sx={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
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
        ),
        muiTableBodyRowProps: null,
      };

    return {
      renderRowActions: null,
      renderRowActionMenuItems: ({ row }) => {
        if (row.original.xIsArchived)
          return [
            <MenuItem
              key="restore"
              onClick={() => {
                handleUnarchive(row.original.id);
              }}
            >
              <ListItemIcon>
                <Unarchive fontSize="small" />
              </ListItemIcon>
              <ListItemText>Restore</ListItemText>
            </MenuItem>,
          ];

        return [
          <MenuItem key="pin" onClick={() => {}}>
            <ListItemIcon>
              <Place />
            </ListItemIcon>
            <ListItemText>Pin</ListItemText>
          </MenuItem>,
          <MenuItem
            key="archive"
            onClick={() => {
              handleArchive(row.original.id);
            }}
          >
            <ListItemIcon>
              <Archive />
            </ListItemIcon>
            <ListItemText>Archive</ListItemText>
          </MenuItem>,
          <MenuItem
            key="delete"
            onClick={() => {
              setSelectedData(row.original);
              setIsDeleteDialogOpen(true);
            }}
          >
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>,
        ];
      },
      muiTableBodyRowProps: ({ row }) => ({
        onClick: (event) => {
          if (!row.original.xIsArchived) {
            setSelectedData(row.original);
            setIsEquipmentDetailViewerOpen(true);
          }
        },
        sx: {
          cursor: "pointer",
        },
      }),
    };
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
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          overflow: "hidden",
          // overflowY: "hidden",
        }}
      >
        <MaterialReactTable
          enableEditing={!showingArchivedData && editingTable}
          editingMode="table"
          enableRowNumbers={!editingTable}
          displayColumnDefOptions={{ "mrt-row-actions": { size: 110 } }}
          enableRowSelection={!editingTable}
          enableMultiRowSelection
          renderTopToolbarCustomActions={({ table }) => (
            <Stack
              sx={{
                flexDirection: "row",
                gap: 2,
                justifyContent: "space-between",
                flex: 1,
              }}
            >
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
              <Stack sx={{ flexDirection: "row", gap: 1 }}>
                <Tooltip
                  title={
                    showingArchivedData ? "Hide archived" : "Show archived"
                  }
                  arrow
                >
                  <IconButton
                    disabled={editingTable}
                    onClick={() => setShowingArchivedData(!showingArchivedData)}
                  >
                    <Archive />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={editingTable ? "Stop editing" : "Edit table"}
                  arrow
                >
                  <IconButton
                    disabled={showingArchivedData}
                    onClick={() => setEditingTable(!editingTable)}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          )}
          enableRowActions={!editingTable}
          {...renderRowActions()}
          data={data.filter((d) => d.xIsArchived == showingArchivedData)}
          columns={
            register?.formFields
              ? [
                  {
                    accessorKey: "xInfox",
                    header: "Info",
                    enableSorting: false,
                    enableColumnFilter: false,
                    enableColumnActions: false,
                    Cell: ({ renderedCellValue, row }) => (
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
                        <Typography variant="caption">
                          {row.original.xArchivedBy?.fullName ||
                            row.original.xUpdatedBy?.fullName ||
                            row.original.xCreatedBy?.fullName}
                          <br />
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
                    ),
                  },
                  ...register?.formFields
                    ?.filter((field) => field.showInRegister)
                    .sort((first, second) => first.order - second.order)
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
                    })),
                ]
              : []
          }
          muiTableBodyCellEditTextFieldProps={({ cell }) => ({
            onBlur: (event) => {
              onCellEdit(
                cell.row.original.id,
                cell.column.id,
                event.target.value
              );
            },
          })}
          slots={{ toolbar: GridToolbar }}
          enablePagination={false}
          enableRowVirtualization
          state={{ isLoading: loading }}
          enableColumnResizing
          enableColumnActions
          enableBottomToolbar={false}
        />
      </Box>

      <Drawer
        anchor={"bottom"}
        open={isEquipmentDetailViewerOpen}
        onClose={onCloseEquipmentDetailViewer}
        sx={{ maxHeight: window.outerHeight - 100, zIndex: 1400 }}
      >
        <Box
          sx={{
            height: "100%",
            backgroundColor: theme.palette.background.default,
            zIndex: 1400,
          }}
        >
          <EquipmentDataForm
            tab="pin"
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
