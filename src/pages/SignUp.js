import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            autoComplete="email"
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
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            Register
          </Button>
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
