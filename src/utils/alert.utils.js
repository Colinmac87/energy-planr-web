import { toast } from "react-hot-toast";

const ALERT_DURATION = 4000;

const alertConfig = {
  position: "bottom-center",
  duration: ALERT_DURATION,
  // Aria
  ariaProps: {
    role: "status",
    "aria-live": "polite",
  },
};

export const alertInfo = (msg) =>
  toast(msg, {
    ...alertConfig,
    icon: "ℹ️",
    style: {
      border: "4px solid lightblue",
    },
  });

export const alertSuccess = (msg) =>
  toast(msg, {
    ...alertConfig,
    icon: "✅",
    style: {
      border: "4px solid green",
    },
  });

export const alertError = (msg) =>
  toast(msg, {
    ...alertConfig,
    icon: "❌",
    style: {
      border: "4px solid red",
    },
  });
