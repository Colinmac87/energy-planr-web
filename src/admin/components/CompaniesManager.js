import { Block, Delete, Edit, RestartAlt } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CompanyForm from "./CompanyForm";
import { useEffect, useState } from "react";
import {
  activateCompany,
  disableCompany,
  //   deleteCompany,
  getCompanies,
} from "../services/company.service";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

const CompaniesManager = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [isCompanyDeleteDialogOpen, setIsCompanyDeleteDialogOpen] =
    useState(false);
  const [companies, setCompanies] = useState([]);
  const [contextCompany, setContextCompany] = useState();

  const [filter, setFilter] = useState({ status: "active" });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    getCompanies().then((data) => setCompanies(data));
  };

  const handleDeleteCompany = () => {
    disableCompany(contextCompany.id)
      .then(() => {
        loadCompanies();
        enqueueSnackbar("Company disabled", { variant: "success" });
        onCloseCompanyDeleteDialogOpen();
      })
      .catch(() => {
        enqueueSnackbar(
          "Unable to disable company, please try again or contact us",
          { variant: "error" }
        );
        onCloseCompanyDeleteDialogOpen();
      });
  };

  const handleActivateCompany = (company) => {
    activateCompany(company.id)
      .then(() => {
        loadCompanies();
        enqueueSnackbar("Company re-activated", { variant: "success" });
        onCloseCompanyDeleteDialogOpen();
      })
      .catch(() => {
        enqueueSnackbar(
          "Unable to re-activate company, please try again or contact us",
          { variant: "error" }
        );
        onCloseCompanyDeleteDialogOpen();
      });
  };

  const onCloseCompanyForm = () => {
    setContextCompany(null);
    setIsCompanyFormOpen(false);
  };

  const onCloseCompanyDeleteDialogOpen = () => {
    setContextCompany(null);
    setIsCompanyDeleteDialogOpen(false);
  };

  return (
    <Grid
      container
      rowGap={4}
      sx={{
        alignContent: "flex-start",
      }}
    >
      <Grid item md={8} p={2}>
        <Typography variant="h4">Companies</Typography>
      </Grid>
      <Grid item md={4} p={2}>
        <Stack
          sx={{ flexDirection: "row", justifyContent: "flex-end", gap: 2 }}
        >
          <FormControl sx={{}}>
            <InputLabel>Show</InputLabel>
            <Select
              sx={{ width: 160 }}
              value={filter.status}
              label="Role"
              onChange={(e) =>
                setFilter({
                  ...filter,
                  status: e.target.value,
                })
              }
            >
              <MenuItem value={"all"}>All</MenuItem>
              <MenuItem value={"active"}>Active</MenuItem>
              <MenuItem value={"inactive"}>Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={() => {
              setIsCompanyFormOpen(true);
            }}
          >
            New Company
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
            }}
          >
            {companies
              .filter(
                (company) =>
                  filter.status == "all" || company.status == filter.status
              )
              .map((company, i) => {
                return (
                  <>
                    {i > 0 && <Divider />}
                    <ListItem
                      secondaryAction={
                        <Stack direction="row" gap={4}>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => {
                              setContextCompany(company);
                              setIsCompanyFormOpen(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          {company.status == "active" ? (
                            <IconButton
                              edge="end"
                              aria-label="disable"
                              onClick={() => {
                                setContextCompany(company);
                                setIsCompanyDeleteDialogOpen(true);
                              }}
                            >
                              <Block />
                            </IconButton>
                          ) : (
                            <IconButton
                              edge="end"
                              aria-label="enable"
                              onClick={() => {
                                handleActivateCompany(company);
                              }}
                            >
                              <RestartAlt />
                            </IconButton>
                          )}
                        </Stack>
                      }
                    >
                      <ListItemText
                        primary={company.name}
                        secondary={
                          <Chip
                            sx={{ mt: 1 }}
                            label={company.status}
                            size="small"
                            color={
                              company.status == "active" ? "success" : "warning"
                            }
                          />
                        }
                      />
                    </ListItem>
                  </>
                );
              })}
          </List>
        </Box>
      </Grid>

      <Drawer
        anchor={"right"}
        open={isCompanyFormOpen}
        onClose={onCloseCompanyForm}
      >
        <Box
          sx={{
            width: 440,
            flex: 1,
            height: "100%",
            backgroundColor: theme.palette.background.paper,
            p: 2,
          }}
        >
          <CompanyForm
            company={contextCompany}
            onSaving={() => {}}
            onSave={() => {
              onCloseCompanyForm();
              loadCompanies();
            }}
            onCancel={onCloseCompanyForm}
          />
        </Box>
      </Drawer>

      <Dialog
        open={isCompanyDeleteDialogOpen}
        onClose={onCloseCompanyDeleteDialogOpen}
      >
        <DialogTitle>
          Are you sure you want to disable this company?
        </DialogTitle>
        <DialogActions>
          <Button onClick={onCloseCompanyDeleteDialogOpen}>Cancel</Button>
          <Button onClick={handleDeleteCompany} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default CompaniesManager;
