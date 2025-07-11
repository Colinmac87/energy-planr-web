import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { GithubPicker } from "react-color";
import WithFormField from "../../components/formUI/WithFormField";
import {
  FIELD_CHECKBOXES,
  FIELD_DATERANGE,
  FIELD_DATETIME,
  FIELD_DROPDOWN,
  FIELD_MULTILINE,
  FIELD_NUMERIC,
  FIELD_TEXT,
  FIELD_TRIGGER_OPERATOR_BETWEEN,
  FIELD_TRIGGER_OPERATOR_CONTAINS,
  FIELD_TRIGGER_OPERATOR_EQUALTO,
  FIELD_TRIGGER_OPERATOR_GREATEREQUAL,
  FIELD_TRIGGER_OPERATOR_GREATERTHAN,
  FIELD_TRIGGER_OPERATOR_LESSEQUAL,
  FIELD_TRIGGER_OPERATOR_LESSTHAN,
  FIELD_TRIGGER_OPERATOR_NOTEQUALTO,
  FIELD_TRIGGER_OPERATOR_OUTSIDE,
  FIELD_YESNO,
} from "../../constants/form.constants";
import { ExpandMore } from "@mui/icons-material";

const allOperators = {
  less: {
    text: "Less than",
    value: FIELD_TRIGGER_OPERATOR_LESSTHAN,
  },
  lessEqual: {
    text: "Less than or equals to",
    value: FIELD_TRIGGER_OPERATOR_LESSEQUAL,
  },
  equal: {
    text: "Equals to",
    value: FIELD_TRIGGER_OPERATOR_EQUALTO,
  },
  notEqual: {
    text: "Not equals to",
    value: FIELD_TRIGGER_OPERATOR_NOTEQUALTO,
  },
  greaterEqual: {
    text: "Greater than or equals to",
    value: FIELD_TRIGGER_OPERATOR_GREATEREQUAL,
  },
  greater: {
    text: "Greater than",
    value: FIELD_TRIGGER_OPERATOR_GREATERTHAN,
  },
  betweenRange: {
    text: "Within range",
    value: FIELD_TRIGGER_OPERATOR_BETWEEN,
  },
  outsideRange: {
    text: "Out of range",
    value: FIELD_TRIGGER_OPERATOR_OUTSIDE,
  },
  contains: {
    text: "Contains",
    value: FIELD_TRIGGER_OPERATOR_CONTAINS,
  },
};

const FieldTriggerOptions = ({ field, onChange }) => {
  const theme = useTheme();
  const [conditions, setConditions] = useState([]);
  const [availableOperators, setAvailableOperators] = useState([]);

  const [operator, setOperator] = useState(
    field?.triggers?.operator || FIELD_TRIGGER_OPERATOR_EQUALTO
  );
  const [compareValue, setCompareValue] = useState(
    field?.triggers?.compareValue || null
  );
  const [actions, setActions] = useState(
    field?.triggers?.actions || {
      registerCellHighlight: {
        isActive: false,
        color: theme.palette.mode == "light" ? "#000" : "#fff",
      },
      mapPinHighlight: {
        isActive: false,
        color: theme.palette.mode == "light" ? "#000" : "#fff",
      },
    }
  );

  useEffect(() => {
    switch (field.type) {
      case FIELD_TEXT:
      case FIELD_MULTILINE:
        setAvailableOperators([
          allOperators.equal,
          allOperators.notEqual,
          allOperators.contains,
        ]);
        break;

      case FIELD_DROPDOWN:
      case FIELD_CHECKBOXES:
      case FIELD_YESNO:
        setAvailableOperators([allOperators.equal, allOperators.notEqual]);
        break;

      case FIELD_NUMERIC:
      case FIELD_DATETIME:
        setAvailableOperators([
          allOperators.less,
          allOperators.lessEqual,
          allOperators.equal,
          allOperators.notEqual,
          allOperators.greaterEqual,
          allOperators.greater,
        ]);
        break;

      case FIELD_DATERANGE:
        setAvailableOperators([
          allOperators.betweenRange,
          allOperators.outsideRange,
        ]);
        break;

      default:
        setAvailableOperators([]);
        break;
    }
  }, [field?.type]);

  useEffect(() => {
    onChange({
      operator,
      compareValue,
      actions,
    });
  }, [operator, compareValue, actions]);

  if (availableOperators.length == 0) return null;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography>Triggers</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              Format
            </Grid>
            <Grid item xs={9}>
              <Select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
              >
                {availableOperators.map((op) => (
                  <MenuItem value={op.value}>{op.text}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={3}>
              Value
            </Grid>
            <Grid item xs={9}>
              <WithFormField
                field={field}
                value={compareValue}
                onChange={(v) => setCompareValue(v)}
                showLabel={false}
                showHelpText={false}
              />
            </Grid>

            <Grid item xs={3}>
              Action
            </Grid>
            <Grid item xs={9}>
              <Stack flexDirection={"row"} gap={2}>
                <Stack flex={1} gap={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          "&.Mui-checked": {
                            color: actions.registerCellHighlight.color,
                          },
                        }}
                        checked={actions.registerCellHighlight.isActive}
                        onChange={(e) =>
                          setActions({
                            ...actions,
                            registerCellHighlight: {
                              ...actions.registerCellHighlight,
                              isActive: e.target.checked,
                            },
                          })
                        }
                      />
                    }
                    label="Register Cell Highlight"
                  />
                  <GithubPicker
                    triangle="hide"
                    disabled={!actions.registerCellHighlight.isActive}
                    color={actions.registerCellHighlight.color}
                    onChangeComplete={(color) =>
                      setActions({
                        ...actions,
                        registerCellHighlight: {
                          ...actions.registerCellHighlight,
                          color: color.hex,
                        },
                      })
                    }
                  />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default FieldTriggerOptions;
