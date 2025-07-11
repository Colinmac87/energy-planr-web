import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  FIELD_TRIGGER_OPERATOR_BETWEEN,
  FIELD_TRIGGER_OPERATOR_CONTAINS,
  FIELD_TRIGGER_OPERATOR_EQUALTO,
  FIELD_TRIGGER_OPERATOR_GREATEREQUAL,
  FIELD_TRIGGER_OPERATOR_GREATERTHAN,
  FIELD_TRIGGER_OPERATOR_LESSEQUAL,
  FIELD_TRIGGER_OPERATOR_LESSTHAN,
  FIELD_TRIGGER_OPERATOR_NOTEQUALTO,
  FIELD_TRIGGER_OPERATOR_OUTSIDE,
} from "../../constants/form.constants";

const WithCellTriggerEffect = ({ field, value, children }) => {
  const [styles, setStyles] = useState({});

  useEffect(() => {
    if (field.triggers) {
      if (field.triggers.actions.registerCellHighlight.isActive == true) {
        const compareValue = field.triggers.compareValue;
        const cellHighlightColor =
          field.triggers.actions.registerCellHighlight.color;

        switch (field.triggers.operator) {
          case FIELD_TRIGGER_OPERATOR_LESSTHAN:
            if (value < compareValue)
              setStyles({
                backgroundColor: cellHighlightColor,
                paddingLeft: 1,
                paddingRight: 1,
              });
            break;
          case FIELD_TRIGGER_OPERATOR_LESSEQUAL:
            if (value <= compareValue)
              setStyles({
                backgroundColor: cellHighlightColor,
                paddingLeft: 1,
                paddingRight: 1,
              });
            break;
          case FIELD_TRIGGER_OPERATOR_EQUALTO:
            if (value == compareValue)
              setStyles({
                backgroundColor: cellHighlightColor,
                paddingLeft: 1,
                paddingRight: 1,
              });
            break;
          case FIELD_TRIGGER_OPERATOR_NOTEQUALTO:
            if (value != compareValue)
              setStyles({
                backgroundColor: cellHighlightColor,
                paddingLeft: 1,
                paddingRight: 1,
              });
            break;
          case FIELD_TRIGGER_OPERATOR_CONTAINS:
            try {
              if (value.includes(compareValue))
                setStyles({
                  backgroundColor: cellHighlightColor,
                  paddingLeft: 1,
                  paddingRight: 1,
                });
            } catch (error) {}
            break;
          case FIELD_TRIGGER_OPERATOR_GREATEREQUAL:
            if (value >= compareValue)
              setStyles({
                backgroundColor: cellHighlightColor,
                paddingLeft: 1,
                paddingRight: 1,
              });
            break;
          case FIELD_TRIGGER_OPERATOR_GREATERTHAN:
            if (value > compareValue)
              setStyles({
                backgroundColor: cellHighlightColor,
                paddingLeft: 1,
                paddingRight: 1,
              });
            break;
          case FIELD_TRIGGER_OPERATOR_BETWEEN:
            try {
              const [start, end] = value.split(",");
              if (value >= start && value <= end)
                setStyles({
                  backgroundColor: cellHighlightColor,
                  paddingLeft: 1,
                  paddingRight: 1,
                });
            } catch (error) {}
            break;
          case FIELD_TRIGGER_OPERATOR_OUTSIDE:
            const [start1, end1] = value.split(",");
            if (value < start1 || value > end1)
              setStyles({
                backgroundColor: cellHighlightColor,
                paddingLeft: 1,
                paddingRight: 1,
              });
            break;
          default:
        }
      }
    }
  }, [value]);

  return <Box sx={{ ...styles, wordWrap: "break-word" }}>{children}</Box>;
};

export default WithCellTriggerEffect;
