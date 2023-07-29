import { DoubleArrow } from "@mui/icons-material";
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";

const CompanyRedirect = () => {
  const theme = useTheme();
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    window.location.href = `${window.location.protocol}/signin/${code}`;
  };

  return (
    <Grid container component="main" sx={{ height: "100vh", width: "100wh" }}>
      <Grid item xs={0} sm={3} md={4}></Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Stack
          sx={{
            height: "100vh",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Paper component="form" elevation={6} sx={{ p: 6 }}>
            <div style={{ textAlign: "center" }}>
              {theme.palette.mode == "dark" ? (
                <img
                  src={require("../assets/images/logo-white.png")}
                  alt="Energy Planr"
                  style={{
                    width: 256,
                  }}
                />
              ) : (
                <img
                  src={require("../assets/images/logo-black.png")}
                  alt="Energy Planr"
                  style={{
                    width: 256,
                  }}
                />
              )}
            </div>
            <br />
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Company Code
              </InputLabel>
              <OutlinedInput
                value={code}
                onChange={(e) => setCode(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      aria-label="submit"
                      onClick={handleSubmit}
                      edge="end"
                    >
                      <DoubleArrow />
                    </IconButton>
                  </InputAdornment>
                }
                label="Company Code"
              />
            </FormControl>
            <Typography variant="caption">
              You'll be taken to your company signin page
            </Typography>
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CompanyRedirect;
