import {
  Box,
  Typography,
  TextField,
  CssBaseline,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { signIn } from "../services/auth.service";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { getCompany } from "../services/company.service";
import CompanyRedirect from "./CompanyRedirect";
import CompanyNotFound from "./CompanyNotFound";
import { useSnackbar } from "notistack";

const SignIn = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { companyCode } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);

  const [companyLookupCompleted, setCompanyLookupCompleted] = useState(false);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    getCompany(companyCode)
      .then((data) => {
        setCompany(data);
      })
      .finally(() => setCompanyLookupCompleted(true));
  }, []);

  useEffect(() => {
    if (account.loginAttempted && account.user) navigate("/");
  }, [account.loginAttempted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      signIn({ companyId: company.id, email, password })
        .then((user) => {
          if (user) {
            setTimeout(() => navigate("/"), 100);
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

  if (!account.loginAttempted) return null;

  if (!companyCode) return <CompanyRedirect />;

  if (!companyLookupCompleted) return null;

  if (!company) return <CompanyNotFound />;

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />

      <Grid
        item
        xs={0}
        sm={4}
        md={7}
        sx={{
          backgroundImage:
            "url(https://accordantco.com/wp-content/uploads/construction-site-tablet.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={require("../assets/images/logo-gray.png")}
          alt="Energy Planr"
          style={{
            margin: 32,
            width: 256,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            pl: 8,
            pr: 8,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            alt={company.name}
            src={company.logoUrl}
            style={{
              maxWidth: 256,
            }}
          />
          <br />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
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
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignIn;
