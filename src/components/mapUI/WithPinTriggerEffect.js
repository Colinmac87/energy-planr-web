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

const WithMapTriggerEffect = ({ field, value, children }) => {
  if (field.triggers) {
      if (field.triggers.actions.mapPinHighlight.isActive == true) {
        let isTriggered = false;
      const compareValue = field.triggers.compareValue;
      const pinHighlightColor = field.triggers.actions.mapPinHighlight.color;

      switch (field.triggers.operator) {
        case FIELD_TRIGGER_OPERATOR_LESSTHAN:
          if (value < compareValue) isTriggered = true;
          break;
        case FIELD_TRIGGER_OPERATOR_LESSEQUAL:
          if (value <= compareValue) isTriggered = true;
          break;
        case FIELD_TRIGGER_OPERATOR_EQUALTO:
          if (value == compareValue) isTriggered = true;
          break;
        case FIELD_TRIGGER_OPERATOR_NOTEQUALTO:
          if (value != compareValue) isTriggered = true;
          break;
        case FIELD_TRIGGER_OPERATOR_CONTAINS:
          try {
            if (value.includes(compareValue)) isTriggered = true;
          } catch (error) {}
          break;
        case FIELD_TRIGGER_OPERATOR_GREATEREQUAL:
          if (value >= compareValue) isTriggered = true;
          break;
        case FIELD_TRIGGER_OPERATOR_GREATERTHAN:
          if (value > compareValue) isTriggered = true;
          break;
        case FIELD_TRIGGER_OPERATOR_BETWEEN:
          try {
            const [start, end] = value.split(",");
            if (value >= start && value <= end) isTriggered = true;
          } catch (error) {}
          break;
        case FIELD_TRIGGER_OPERATOR_OUTSIDE:
          const [start1, end1] = value.split(",");
          if (value < start1 || value > end1) isTriggered = true;
          break;
        default:
      }

      if(isTriggered){
        return {
            
        }
      }
    }
  }

  return {};
};

export default WithMapTriggerEffect;
