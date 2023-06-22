import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  FIELD_TRIGGER_OPERATOR_EQUALTO,
  FIELD_TRIGGER_OPERATOR_GREATEREQUAL,
  FIELD_TRIGGER_OPERATOR_GREATERTHAN,
  FIELD_TRIGGER_OPERATOR_LESSEQUAL,
  FIELD_TRIGGER_OPERATOR_LESSTHAN,
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
              setStyles({ backgroundColor: cellHighlightColor });
            break;
          case FIELD_TRIGGER_OPERATOR_LESSEQUAL:
            if (value <= compareValue)
              setStyles({ backgroundColor: cellHighlightColor });
            break;
          case FIELD_TRIGGER_OPERATOR_EQUALTO:
            if (value == compareValue)
              setStyles({ backgroundColor: cellHighlightColor });
            break;
          case FIELD_TRIGGER_OPERATOR_GREATEREQUAL:
            if (value >= compareValue)
              setStyles({ backgroundColor: cellHighlightColor });
            break;
          case FIELD_TRIGGER_OPERATOR_GREATERTHAN:
            if (value > compareValue)
              setStyles({ backgroundColor: cellHighlightColor });
            break;
          default:
        }
      }
    }
  }, [value]);

  return <Box sx={styles}>{children}</Box>;
};

export default WithCellTriggerEffect;
