import {
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FIELD_DICT } from "../constants/form.constants";
import {
  ArrowDownward,
  ArrowUpward,
  CloudDone,
  CloudOff,
  Delete,
} from "@mui/icons-material";
import { saveFormFields } from "../services/asset.service";
import { alertError, alertSuccess } from "../utils/alert.utils";
import WithFormBuilderFieldOptions from "./formBuilder/WithFormBuilderFieldOptions";

const FormFieldsManager = ({ asset, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    setFields(asset?.formFields.sort((a, b) => b - a) || []);
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
    const fieldsCopy = JSON.parse(JSON.stringify(fields));
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
        type: "",
        required: false,
        span: 12,
        group: "none",
        meta: {},
      },
    ]);
  };

  const handleSave = () => {
    setLoading(true);

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
    <Grid container rowGap={4}>
      <Grid item md={12}>
        <Stack flexDirection={"row"} gap={2} justifyContent={"space-between"}>
          <Typography variant="h4">Data Fields</Typography>
          <Button variant="contained" disabled={loading} onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Grid>

      {fields.map((field, i) => (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, pt: 3, mb: 2 }}>
            <Stack
              flexDirection={"row"}
              gap={4}
              mb={4}
              justifyContent={"space-between"}
            >
              {field.key ? <CloudDone /> : <CloudOff />}
              <Stack flexDirection={"row"} gap={4} justifyContent={"flex-end"}>
                {i > 0 && (
                  <IconButton aria-label="move up" onClick={() => moveUp(i)}>
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
                <IconButton aria-label="delete" onClick={() => removeField(i)}>
                  <Delete />
                </IconButton>
              </Stack>
            </Stack>
            <Stack gap={2}>
              <TextField
                label={"Name"}
                fullWidth
                value={field.name}
                onChange={(e) => {
                  onChangeFieldProperty(i, "name", e.target.value);
                }}
              />
              <FormControl>
                <InputLabel>Type</InputLabel>
                <Select
                  fullWidth
                  label="Type"
                  value={field.type}
                  onChange={(e) => {
                    onChangeFieldProperty(i, "type", e.target.value);
                  }}
                >
                  {getFieldTypesArray().map((fieldType) => (
                    <MenuItem value={fieldType.value}>
                      {fieldType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack flexDirection={"row"} gap={2}>
                <FormControl fullWidth>
                  <InputLabel>Required</InputLabel>
                  <Select
                    fullWidth
                    label="Required"
                    value={field.required ? "yes" : "no"}
                    onChange={(e) => {
                      onChangeFieldProperty(
                        i,
                        "required",
                        e.target.value == "yes" ? true : false
                      );
                    }}
                  >
                    <MenuItem value={"yes"}>Yes</MenuItem>
                    <MenuItem value={"no"}>No</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label={"Span"}
                  type="number"
                  fullWidth
                  value={fields[i].span}
                  onChange={(e) => {
                    onChangeFieldProperty(i, "span", e.target.value);
                  }}
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
              <Divider>More Options</Divider>
              <WithFormBuilderFieldOptions
                type={field.type}
                meta={field.meta}
                onChange={(v) => {
                  onChangeFieldProperty(i, "meta", v);
                }}
              />
            </Stack>
          </Paper>
        </Grid>
      ))}

      <Grid item md={12} textAlign={"center"}>
        <Button variant="contained" onClick={addField}>
          New Field
        </Button>
      </Grid>
    </Grid>
  );
};

export default FormFieldsManager;
