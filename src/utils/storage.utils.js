export const saveKey = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

export const getKey = (key) => {
  try {
    const x = localStorage.getItem(key);
    return x;
  } catch (error) {
    console.log(error);
  }
};
