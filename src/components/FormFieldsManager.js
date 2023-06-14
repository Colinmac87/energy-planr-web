import {
  AppBar,
  Box,
  Button,
  Divider,
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
  Typography,
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
  Save,
} from "@mui/icons-material";
import { saveFormFields } from "../services/asset.service";
import { alertError, alertSuccess } from "../utils/alert.utils";
import WithFormBuilderFieldOptions from "./formBuilder/WithFormBuilderFieldOptions";
import {
  canBeDefaultField,
  canShowInRegister,
  getDefaultField,
  validateFormBuilder,
} from "../utils/form.utils";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";

const FormFieldsManager = ({ onSave }) => {
  const { asset } = useSelector((state) => state.asset);

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (!asset.formFields || asset.formFields.length == 0) addField();
    else setFields(asset?.formFields || []);
  }, [asset]);

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

  const onChangeFieldProperty = (index, property, value) => {
    let fieldsCopy = JSON.parse(JSON.stringify(fields));

    if (property == "type") {
      fieldsCopy = fieldsCopy.map((f) => ({
        ...f,
        showInRegister: canShowInRegister(value),
      }));
    }

    if (property == "isDefault") {
      fieldsCopy = fieldsCopy.map((f) => ({
        ...f,
        isDefault: false,
      }));
    }

    fieldsCopy[index][property] = value;
    setFields(fieldsCopy);
  };

  const moveUp = (index) => {
    const fieldsCopy = JSON.parse(JSON.stringify(fields));
    const fieldObject = fieldsCopy[index];

    fieldsCopy[index] = fieldsCopy[index - 1];
    fieldsCopy[index - 1] = fieldObject;

    setFields(fieldsCopy);
  };

  const moveDown = (index) => {
    const fieldsCopy = JSON.parse(JSON.stringify(fields));
    const fieldObject = fieldsCopy[index];

    fieldsCopy[index] = fieldsCopy[index + 1];
    fieldsCopy[index + 1] = fieldObject;

    setFields(fieldsCopy);
  };

  const removeField = (index) => {
    const fieldsCopy = JSON.parse(JSON.stringify(fields));
    fieldsCopy.splice(index, 1);
    setFields(fieldsCopy);
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        name: "",
        type: getDefaultField(),
        required: false,
        span: 12,
        group: "none",
        isDefault: fields.length == 0,
        showInRegister: true,
        meta: {},
      },
    ]);
  };

  const handleSave = () => {
    setLoading(true);
    const validationResult = validateFormBuilder(fields);
    if (!validationResult.isValid) {
      validationResult.errors.forEach((error) => alertError(error));
      setLoading(false);
      return;
    }

    saveFormFields(asset.id, { formFields: fields })
      .then(() => {
        alertSuccess("Changes saved.");
        onSave();
      })
      .catch(() => {
        alertError("Unable to save changes, please try again or contact us.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexGrow: 1,
        m: 0,
        p: 0,
        pb: 8,
        overflow: "hidden",
        position: "relative",
        borderRadius: 2,
      }}
    >
      <AppBar
        sx={{
          position: "absolute",
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Data Fields
          </Typography>

          <Stack flexDirection={"row"} gap={2}>
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
          backgroundColor: "#eee2",
          minHeight: "100%",
          minWidth: "100%",
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          overflow: "auto",
          mt: 8,
          p: 2,
        }}
      >
        <Grid
          container
          rowGap={1}
          sx={{
            alignContent: "flex-start",
          }}
        >
          {fields.map((field, i) => (
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
                      p: 0,
                      pl: 2,
                      pr: 2,
                      border: "1px solid",
                      borderRadius: 100,
                    }}
                  >
                    {field.key ? (
                      <CloudDone fontSize="small" sx={{ color: "green" }} />
                    ) : (
                      <CloudOff fontSize="small" />
                    )}
                    {field.key && (
                      <Typography variant="caption" sx={{ color: "green" }}>
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
                      label="Required"
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
                      label="Default Field"
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
                      {asset.formGroups?.length > 0 &&
                        asset.formGroups.map((group) => (
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
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default FormFieldsManager;
