import { LoadingButton } from "@mui/lab";
import {
  Box,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminSignIn } from "../../services/auth.service";
import { enqueueSnackbar } from "notistack";

const AdminSignIn = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (account.loginAttempted && account.user) navigate("/admin");
  }, [account.loginAttempted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      adminSignIn({ email, password })
        .then((user) => {
          if (user) {
            navigate("/admin");
          } else
            enqueueSnackbar("Email or password is not correct", {
              variant: "error",
            });
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
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
          <Paper elevation={6} sx={{ p: 6 }}>
            <div style={{ textAlign: "center" }}>
              {theme.palette.mode == "dark" ? (
                <img
                  src={require("../../assets/images/logo-white.png")}
                  alt="Energy Planr"
                  style={{
                    width: 256,
                  }}
                />
              ) : (
                <img
                  src={require("../../assets/images/logo-black.png")}
                  alt="Energy Planr"
                  style={{
                    width: 256,
                  }}
                />
              )}
              <Typography variant="subtitle1">Admin Panel</Typography>
            </div>
            <br />
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
              autoComplete="off"
            >
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="no"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="no"
                onChange={(e) => setPassword(e.target.value)}
              />
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={loading}
              >
                Sign In
              </LoadingButton>
            </Box>
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AdminSignIn;
