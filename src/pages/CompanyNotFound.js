import { Box, Grid, Link, Stack, Typography } from "@mui/material";

const CompanyNotFound = () => {
  return (
    <Grid container component="main" sx={{ height: "100vh", width: "100wh" }}>
      <Grid item xs={0} sm={1} md={2}></Grid>
      <Grid item xs={12} sm={10} md={8}>
        <Stack
          sx={{
            height: "100vh",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            component="form"
            elevation={6}
            sx={{ p: 6, textAlign: "center" }}
          >
            <Typography variant="h2">Looks like you're lost!</Typography>
            <br />
            <Link href="/signin" underline="none">
              Take Me Home
            </Link>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CompanyNotFound;
