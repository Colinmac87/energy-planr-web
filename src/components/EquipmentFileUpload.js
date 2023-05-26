import { useState } from "react";
import {
  Drawer,
  LinearProgress,
  Grid,
  Typography,
  Box,
  Button,
  Stack,
} from "@mui/material";
import Papa from "papaparse";
import { camelize, generateId } from "../utils/string.utils";
import { UploadFile } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";

const EquipmentFileUpload = ({ isOpen, onClose, onSave }) => {
  const { asset } = useSelector((state) => state.asset);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const onClickDownloadTemplate = () => {
    const csv = Papa.unparse({
      fields: asset.formFields.map((field) => field.name),
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
          const o = {};
          for (const prop in row) {
            o.id = generateId();
            o.x = Math.floor(Math.random() * 100);
            o.y = Math.floor(Math.random() * 100);
            o[camelize(prop)] = row[prop];
          }

          tempDataArr.push(o);
        });
        setData(tempDataArr);
      },
    });
  };

  return (
    <Drawer
      anchor={"bottom"}
      open={isOpen}
      onClose={!loading && onClose}
      sx={{ maxHeight: window.outerHeight - 100 }}
    >
      <Box sx={{ p: 4 }}>
        <Grid container spacing={1} gap={2}>
          {!data ? (
            <>
              <Grid item xs={12}>
                <Typography variant="h4">Import Data</Typography>
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
                <Typography variant="h4">Preview</Typography>
              </Grid>
              <Grid item xs={12}>
                <DataGrid
                  rows={[]}
                  columns={asset?.formFields?.map((field) => ({
                    field: field.key,
                    headerName: field.name,
                    width: 200,
                    // renderCell: ({ value }) => (
                    //   <WithDataField
                    //     field={field}
                    //     value={value}
                    //     withLabel={false}
                    //   />
                    // ),
                  }))}
                  // pageSizeOptions={[5, 20, 50, 100]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Grid>
              <Grid item xs={12}>
                <LoadingButton variant="contained" loading>
                  Import Selections
                </LoadingButton>
              </Grid>
            </>
          )}

          {/* <Grid item xs={12}>
            <Typography variant="h6">Processing File</Typography>
            <Typography variant="body2">Please wait ...</Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress />
          </Grid> */}
        </Grid>
      </Box>
    </Drawer>
  );
};

export default EquipmentFileUpload;
