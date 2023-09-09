export const fromSecs = (secs) => {
  const t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
};

export const withFormat = (date, format = "UK") => {
  if (format === "UK") {
    const originalHours = date.getHours();
    const hours = originalHours % 12 == 0 ? 12 : originalHours % 12;

    var formattedHours = ("0" + hours).slice(-2);
    var formattedMinutes = ("0" + date.getMinutes()).slice(-2);

    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${formattedHours}:${formattedMinutes} ${
      originalHours > 12 ? "PM" : "AM"
    }`;
  }

  return date.toLocaleString();
};
