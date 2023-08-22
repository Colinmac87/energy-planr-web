import { useEffect, useState } from "react";
import {
  Drawer,
  LinearProgress,
  Grid,
  Typography,
  Box,
  Button,
  Stack,
  IconButton,
  useTheme,
} from "@mui/material";
import Papa from "papaparse";
import { camelize, generateId } from "../utils/string.utils";
import { Close, UploadFile } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import {
  isFieldUploadParsable,
  muiDataGridCellEditProps,
  tryParseValue,
} from "../utils/form.utils";
import WithDataField from "./dataUI/WithDataField";
import { createDataBulk } from "../services/data.service";
import { useSnackbar } from "notistack";

const EquipmentFileUpload = ({ register, isOpen, onClose, onSave }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { asset } = useSelector((state) => state.asset);
  const gridApiRef = useGridApiRef();

  const [data, setData] = useState(null);
  const [selectedDataIds, setSelectedDataIds] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data != null && !isPreview) {
      // let dataCopy = JSON.parse(JSON.stringify(data));

      // for (let col = 0; col < data[0].length; col++) {
      //   // get field type here
      //   for (let row = 0; row < data.length; row++) {
      //     dataCopy[row][col] = tryParseValue(dataCopy[row][col]);
      //   }
      // }
      // // do parsing and transformations

      // setData(dataCopy);
      setIsPreview(true);
    }
  }, [data]);

  const onClickDownloadTemplate = () => {
    const csv = Papa.unparse({
      fields: register?.formFields
        .filter((field) => isFieldUploadParsable(field))
        .map((field) => field.name),
    });

    const blob = new Blob([csv]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob, { type: "text/csv" });
    a.download = `${asset.name}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const onCSVUploaded = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        let tempDataArr = [];
        results.data.map((row) => {
          const o = {
            id: generateId(),
          };
          for (const prop in row) {
            o[camelize(prop)] = row[prop];
          }

          tempDataArr.push(o);
        });
        setData(tempDataArr);
      },
    });
  };

  const onCellEdit = (id, field, value) => {
    const dataCopy = JSON.parse(JSON.stringify(data));
    const index = dataCopy.findIndex((d) => d.id == id);
    dataCopy[index][field] = value;
    setData(dataCopy);
  };

  const handleUpload = () => {
    setLoading(true);

    createDataBulk(
      asset.id,
      register.id,
      data.filter((row) => selectedDataIds.includes(row.id))
    )
      .then((errors) => {
        if (errors.length == 0) {
          enqueueSnackbar("Data uploaded", { variant: "success" });
          onSave();
        } else {
          enqueueSnackbar(`Unable to upload ${errors.length} records`, {
            variant: "error",
          });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Drawer
      anchor={"bottom"}
      open={isOpen}
      onClose={!loading && onClose}
      sx={{ maxHeight: window.outerHeight - 100 }}
    >
      <Box
        sx={{
          p: 4,
          height: "100%",
          width: "100%",
          overflow: "auto",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Grid container spacing={1} gap={2}>
          {!data ? (
            <>
              <Grid item xs={12}>
                <Stack
                  sx={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                  <Typography variant="h4">Import Data</Typography>
                  <IconButton onClick={onClose} disabled={loading}>
                    <Close fontSize="large" />
                  </IconButton>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack flexDirection={"row"} gap={2}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFile />}
                  >
                    Select File
                    <input
                      type="file"
                      hidden
                      accept=".csv"
                      onChange={onCSVUploaded}
                    />
                  </Button>
                  <Button size="small" sx onClick={onClickDownloadTemplate}>
                    Download Template
                  </Button>
                </Stack>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Stack
                  sx={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                  <Stack>
                    <Typography variant="h4">Preview</Typography>
                    <Typography variant="caption">
                      Select a cell and press Enter to edit
                    </Typography>
                  </Stack>
                  <IconButton
                    onClick={() => {
                      setData(null);
                      setIsPreview(false);
                      onClose();
                    }}
                  >
                    <Close fontSize="large" />
                  </IconButton>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                {isPreview ? (
                  <Box sx={{ height: 600, width: "100%" }}>
                    <DataGrid
                      apiRef={gridApiRef}
                      rows={data}
                      columns={register?.formFields
                        ?.filter(
                          (field) =>
                            field.showInRegister && isFieldUploadParsable(field)
                        )
                        .map((field) => ({
                          field: field.key,
                          headerName: field.name,
                          width: 200,
                          ...muiDataGridCellEditProps(field.type),
                          renderCell: ({ value }) => (
                            <WithDataField
                              field={field}
                              value={value}
                              withLabel={false}
                            />
                          ),
                        }))}
                      onCellEditStop={(params, event, details) => {
                        if (event.key == "Enter") {
                          onCellEdit(
                            params.id,
                            params.field,
                            event.target.value
                          );
                        }
                      }}
                      onRowSelectionModelChange={(rows) => {
                        setSelectedDataIds(rows);
                      }}
                      checkboxSelection
                      disableRowSelectionOnClick
                    />
                  </Box>
                ) : (
                  <LinearProgress />
                )}
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  disabled={!isPreview || selectedDataIds.length == 0}
                  onClick={handleUpload}
                >
                  Import Selections
                </LoadingButton>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Drawer>
  );
};

export default EquipmentFileUpload;
