export const fromSecs = (secs) => {
  const t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
};
