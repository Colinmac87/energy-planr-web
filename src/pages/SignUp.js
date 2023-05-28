import {
  Container,
  Box,
  Typography,
  TextField,
  CssBaseline,
  Divider,
  Link,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../services/auth.service";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/account.slice";
import { alertError } from "../utils/alert.utils";
import { LoadingButton } from "@mui/lab";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);

  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (account.loginAttempted && account.user) navigate("/");
  }, [account.loginAttempted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      signUp({ businessName, fullName, email, password })
        .then((user) => {
          if (user) {
            dispatch(setUser(user));
            navigate("/");
          } else
            alertError(
              "Unable to create account, please try again or contact us."
            );
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
  };

  if (!account.loginAttempted) return null;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Energy Planr</Typography>
        <br />
        <Typography component="h1" variant="h5">
          Create an Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="company"
            label="Business Name"
            name="company"
            autoFocus
            onChange={(e) => setBusinessName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Your Full Name"
            autoComplete="no"
            name="fullName"
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="no"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
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
            Register
          </LoadingButton>
          <Divider mt={2} mb={4} />
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link href="/signin" underline="none">
              Sign in with an existing account
            </Link>
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
