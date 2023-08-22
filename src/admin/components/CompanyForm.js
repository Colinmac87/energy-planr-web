import {
  Box,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { createCompany, updateCompany } from "../services/company.service";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { generateKey } from "../../utils/string.utils";

const CompanyForm = ({ company, onSaving, onSave, onCancel }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { company: currentCompany } = useSelector((state) => state.account);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(company?.name);
  const [logo, setLogo] = useState(null);

  const [assetsLimit, setAssetsLimit] = useState(company?.licence?.assetsLimit);
  const [usersLimit, setUsersLimit] = useState(company?.licence?.usersLimit);
  const [licenceExpiryDate, setLicenceExpiryDate] = useState(
    company?.licence?.expiryDate
  );

  const [adminFullName, setAdminFullName] = useState("");
  const [adminEmailAddress, setAdminEmailAddress] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleLogoUpload = (f) => {
    setLogo(f.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSaving();

    if (company?.id) {
      updateCompany(company.id, {
        name,
        logoFile: logo,
        licence: {
          usersLimit,
          assetsLimit,
          expiryDate: licenceExpiryDate,
        },
      })
        .then(() => {
          enqueueSnackbar("Changes saved", { variant: "success" });
          onSave();
        })
        .catch(() => {
          enqueueSnackbar(
            "Unable to save changes, please try again or contact us",
            { variant: "error" }
          );
        })
        .finally(() => setLoading(false));
    } else {
      createCompany({
        company: {
          name: name,
          code: generateKey(name),
          logoFile: logo,
        },
        licence: {
          usersLimit,
          assetsLimit,
          expiryDate: licenceExpiryDate,
        },
        user: {
          adminFullName,
          adminEmailAddress,
          adminPassword,
        },
      })
        .then((companyId) => {
          if (companyId) {
            enqueueSnackbar("New company created", { variant: "success" });
            onSave();
          } else {
            enqueueSnackbar(
              "Unable to create company, please try again or contact us",
              { variant: "error" }
            );
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Box component={"form"} onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" mb={2}>
            {company?.id ? "Update" : "New"} Company
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Stack sx={{ p: 2, gap: 2, spacing: 2, flexDirection: "column" }}>
              <Typography variant="subtitle1">Company Details</Typography>
              <TextField
                label={"Name"}
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                helperText={company?.id ? company.code : generateKey(name)}
              />
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Stack sx={{ p: 2, gap: 2, spacing: 2, flexDirection: "column" }}>
              <Typography variant="subtitle1">Licence Details</Typography>
              <TextField
                label={"Assets limit"}
                variant="outlined"
                type="number"
                fullWidth
                value={assetsLimit}
                onChange={(e) => setAssetsLimit(e.target.value)}
              />
              <TextField
                label={"Users limit"}
                variant="outlined"
                type="number"
                fullWidth
                value={usersLimit}
                onChange={(e) => setUsersLimit(e.target.value)}
              />
              <DatePicker
                label="Expiry Date"
                format="DD-MM-YYYY"
                value={moment(licenceExpiryDate)}
                onChange={(v) => setLicenceExpiryDate(v.valueOf())}
                sx={{
                  flex: 1,
                  width: "100%",
                }}
              />
            </Stack>
          </Paper>
        </Grid>
        {!company?.id && (
          <Grid item xs={12}>
            <Paper>
              <Stack sx={{ p: 2, gap: 2, spacing: 2, flexDirection: "column" }}>
                <Typography variant="subtitle1">Admin Details</Typography>
                <TextField
                  label={"Admin Name"}
                  variant="outlined"
                  fullWidth
                  value={adminFullName}
                  onChange={(e) => setAdminFullName(e.target.value)}
                />
                <TextField
                  label={"Admin Email"}
                  variant="outlined"
                  fullWidth
                  value={adminEmailAddress}
                  onChange={(e) => setAdminEmailAddress(e.target.value)}
                />
                <TextField
                  label={"Admin Password"}
                  variant="outlined"
                  fullWidth
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </Stack>
            </Paper>
          </Grid>
        )}
        <Grid item xs={12}>
          <Stack flexDirection={"row"} justifyContent={"space-between"}>
            {/* <Button variant="outlined" disabled={loading} onClick={onCancel}>
                  Cancel
                </Button> */}
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyForm;
