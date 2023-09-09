import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FIELD_DICT } from "../constants/form.constants";
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  CloudDone,
  CloudOff,
  Delete,
  Preview,
  Save,
} from "@mui/icons-material";
import { saveFormFields } from "../services/register.service";
import WithFormBuilderFieldOptions from "./formBuilder/WithFormBuilderFieldOptions";
import {
  canBeDefaultField,
  canShowInRegister,
  getDefaultField,
  validateFormBuilder,
} from "../utils/form.utils";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import FieldTriggerOptions from "./formBuilder/FieldTriggerOptions";
import { useSnackbar } from "notistack";
import FormPreview from "./formUI/FormPreview";

const FormFieldsManager = ({ register, onChangeRegister, onSave }) => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { registers } = useSelector((state) => state.asset);

  const [formPreviewOpen, setFormPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterGroupKey, setFilterGroupKey] = useState(null);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (register) {
      if (!register.formFields || register.formFields.length == 0) addField();
      else setFields(register?.formFields || []);
    }
  }, [register]);

  const getFieldTypesArray = () => {
    let arr = [];
    for (var prop in FIELD_DICT) {
      if (Object.prototype.hasOwnProperty.call(FIELD_DICT, prop)) {
        arr.push({
          name: FIELD_DICT[prop].name,
          value: FIELD_DICT[prop].value,
        });
      }
    }
    return arr;
  };

  const getVisibleFields = () =>
    JSON.parse(JSON.stringify(fields)).filter(
      (f) => filterGroupKey == "none" || f.group == filterGroupKey
    );

  const onChangeFieldProperty = (index, property, value) => {
    try {
      let fieldsCopy = getVisibleFields();

      if (property == "type") {
        fieldsCopy[index].showInRegister = canShowInRegister(value);
      }

      if (property == "isDefault") {
        fieldsCopy = fieldsCopy.map((f) => ({
          ...f,
          isDefault: false,
        }));
      }

      fieldsCopy[index][property] = value;
      setFields(fieldsCopy);
    } catch (error) {}
  };

  const moveUp = (index) => {
    try {
      const fieldsCopy = getVisibleFields();
      const fieldObject = fieldsCopy[index];

      fieldsCopy[index] = fieldsCopy[index - 1];
      fieldsCopy[index - 1] = fieldObject;

      setFields(fieldsCopy);
    } catch (error) {}
  };

  const moveDown = (index) => {
    try {
      const fieldsCopy = getVisibleFields();
      const fieldObject = fieldsCopy[index];

      fieldsCopy[index] = fieldsCopy[index + 1];
      fieldsCopy[index + 1] = fieldObject;

      setFields(fieldsCopy);
    } catch (error) {}
  };

  const removeField = (index) => {
    try {
      const fieldsCopy = getVisibleFields();
      fieldsCopy.splice(index, 1);
      setFields(fieldsCopy);
    } catch (error) {}
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        name: "",
        type: getDefaultField(),
        required: false,
        span: 12,
        group: filterGroupKey || "none",
        isDefault: fields.length == 0,
        showInRegister: true,
        meta: {},
        triggers: [],
      },
    ]);
  };

  const handleSave = () => {
    setLoading(true);
    const validationResult = validateFormBuilder(fields);
    if (!validationResult.isValid) {
      validationResult.errors.forEach((error) =>
        enqueueSnackbar(error, { variant: "error" })
      );
      setLoading(false);
      return;
    }

    saveFormFields(register.id, { formFields: fields })
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
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flex: 1,
        flexGrow: 1,
        ml: 2,
        mr: 2,
        pb: 11,
        border: "hidden",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <AppBar
        sx={{
          position: "absolute",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Toolbar>
          <Stack
            sx={{
              flexGrow: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color:
                  theme.palette.mode == "light"
                    ? theme.palette.text.primary
                    : null,
              }}
            >
              Fields
            </Typography>
            <FormControl fullWidth sx={{ m: 2 }}>
              <InputLabel>Register</InputLabel>
              <Select
                value={register}
                label="Register"
                onChange={(e) => onChangeRegister(e.target.value)}
              >
                {registers.map((r) => (
                  <MenuItem value={r}>{r.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ m: 2 }}>
              <InputLabel>Group</InputLabel>
              <Select
                value={filterGroupKey}
                label="Group"
                onChange={(e) => setFilterGroupKey(e.target.value)}
              >
                <MenuItem value={null}>-</MenuItem>
                {register?.formGroups.map((g) => (
                  <MenuItem value={g.key}>{g.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack
            flexDirection={"row"}
            gap={2}
            flexGrow={1}
            justifyContent={"flex-end"}
          >
            <Tooltip title="Preview Form">
              <IconButton
                aria-label="preview"
                onClick={() => setFormPreviewOpen(true)}
              >
                <Preview />
              </IconButton>
            </Tooltip>

            <Button variant="outlined" startIcon={<Add />} onClick={addField}>
              New Field
            </Button>

            <LoadingButton
              variant="contained"
              loading={loading}
              onClick={handleSave}
              startIcon={<Save />}
            >
              Save
            </LoadingButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          position: "relative",
          flexDirection: "column",
          backgroundColor: theme.palette.background.default,
          minHeight: "100%",
          minWidth: "100%",
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          overflow: "auto",
          mt: 11,
          p: 0,
        }}
      >
        <Grid
          container
          rowGap={1}
          sx={{
            alignContent: "flex-start",
          }}
        >
          {fields
            .filter((f) => filterGroupKey == null || f.group == filterGroupKey)
            .map((field, i) => (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, pt: 3, mb: 2 }}>
                  <Stack
                    flexDirection={"row"}
                    gap={4}
                    mb={4}
                    justifyContent={"space-between"}
                  >
                    <Stack
                      sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {field.key ? (
                        <CloudDone
                          fontSize="small"
                          sx={{
                            color:
                              theme.palette.mode == "dark"
                                ? theme.palette.primary.main
                                : "green",
                          }}
                        />
                      ) : (
                        <CloudOff fontSize="small" />
                      )}
                      {field.key && (
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              theme.palette.mode == "dark"
                                ? theme.palette.primary.main
                                : "green",
                          }}
                        >
                          saved
                        </Typography>
                      )}
                    </Stack>
                    <Stack
                      flexDirection={"row"}
                      gap={4}
                      justifyContent={"flex-end"}
                    >
                      {i > 0 && (
                        <IconButton
                          aria-label="move up"
                          onClick={() => moveUp(i)}
                        >
                          <ArrowUpward />
                        </IconButton>
                      )}
                      {i < fields.length - 1 && (
                        <IconButton
                          aria-label="move down"
                          onClick={() => moveDown(i)}
                        >
                          <ArrowDownward />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="delete"
                        onClick={() => removeField(i)}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </Stack>
                  <Stack gap={2}>
                    <Stack flexDirection={"row"} gap={2}>
                      <TextField
                        sx={{ flex: 1 }}
                        label={"Name"}
                        fullWidth
                        value={field.name}
                        onChange={(e) => {
                          onChangeFieldProperty(i, "name", e.target.value);
                        }}
                      />
                      <FormControl sx={{ flex: 1 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                          fullWidth
                          label="Type"
                          value={field.type}
                          onChange={(e) => {
                            onChangeFieldProperty(i, "type", e.target.value);
                          }}
                          readOnly={field.key != undefined && field.key != null}
                        >
                          {getFieldTypesArray().map((fieldType) => (
                            <MenuItem value={fieldType.value}>
                              {fieldType.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack flexDirection={"row"} gap={2}>
                      <FormControl fullWidth>
                        <InputLabel>Display Span</InputLabel>
                        <Select
                          fullWidth
                          label="Display Span"
                          value={field.span}
                          onChange={(e) => {
                            onChangeFieldProperty(i, "span", e.target.value);
                          }}
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                          <MenuItem value={4}>4</MenuItem>
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={6}>6</MenuItem>
                          <MenuItem value={7}>7</MenuItem>
                          <MenuItem value={8}>8</MenuItem>
                          <MenuItem value={9}>9</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={11}>11</MenuItem>
                          <MenuItem value={12}>12</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack sx={{ flexDirection: "row", gap: 8 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            disabled={!canBeDefaultField(field.type)}
                            checked={field.isDefault}
                            onChange={(e) =>
                              onChangeFieldProperty(
                                i,
                                "isDefault",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Default Field"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.required}
                            onChange={(e) =>
                              onChangeFieldProperty(
                                i,
                                "required",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Required"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            disabled={!canShowInRegister(field.type)}
                            checked={field.showInRegister}
                            onChange={(e) =>
                              onChangeFieldProperty(
                                i,
                                "showInRegister",
                                e.target.checked
                              )
                            }
                          />
                        }
                        label="Show in Register"
                      />
                    </Stack>
                    <FormControl>
                      <InputLabel>Group</InputLabel>
                      <Select
                        fullWidth
                        label="Group"
                        value={field.group}
                        onChange={(e) => {
                          onChangeFieldProperty(i, "group", e.target.value);
                        }}
                      >
                        <MenuItem value={"none"}>-</MenuItem>
                        {register?.formGroups?.length > 0 &&
                          register.formGroups.map((group) => (
                            <MenuItem value={group.key}>{group.name}</MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                    <WithFormBuilderFieldOptions
                      type={field.type}
                      meta={field.meta}
                      onChange={(v) => {
                        onChangeFieldProperty(i, "meta", v);
                      }}
                    >
                      <Divider>More Options</Divider>
                      <br />
                    </WithFormBuilderFieldOptions>
                    <FieldTriggerOptions
                      field={field}
                      onChange={(v) => {
                        onChangeFieldProperty(i, "triggers", v);
                      }}
                    />
                  </Stack>
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Box>

      {formPreviewOpen && (
        <Drawer
          anchor={"bottom"}
          open={formPreviewOpen}
          onClose={setFormPreviewOpen}
          sx={{ maxHeight: window.outerHeight - 100 }}
        >
          <Box
            sx={{
              height: "100%",
              backgroundColor: theme.palette.background.default,
            }}
          >
            <FormPreview
              register={register}
              fields={fields}
              onClose={() => setFormPreviewOpen(false)}
            />
          </Box>
        </Drawer>
      )}
    </Paper>
  );
};

export default FormFieldsManager;
