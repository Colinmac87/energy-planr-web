import {
  Container,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  CssBaseline,
  Divider,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { signIn } from "../services/auth.service";
import { alertError } from "../utils/alert.utils";
import { setUser } from "../features/account.slice";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (account.loginAttempted && account.user) navigate("/");
  }, [account.loginAttempted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      signIn({ email, password })
        .then((user) => {
          if (user) {
            dispatch(setUser(user));
            navigate("/");
          } else alertError("Email or password is not correct.");
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
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
          <Divider mt={2} mb={4} />
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link href="/signup" underline="none">
              Create an account
            </Link>
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
