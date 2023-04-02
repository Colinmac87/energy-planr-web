import React, { useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  Link,
  Button,
  Drawer,
  Box,
} from "@mui/material";
import PlanForm from "../components/PlanForm";

const plans = [
  {
    id: 1,
    name: "Microsoft head office",
  },
  {
    id: 2,
    name: "Gymshark building",
  },
  {
    id: 3,
    name: "Oraan site",
  },
];

const Home = () => {
  const [isNewPlanFormOpen, setIsNewPlanFormOpen] = useState(false);

  const onCloseNewPlanForm = () => {
    setIsNewPlanFormOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h3" component="div">
          Plans
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={() => setIsNewPlanFormOpen(true)}>
          New Plan
        </Button>
      </Grid>
      {plans.map((plan) => (
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography gutterBottom variant="h6" component="div">
              {plan.name}
            </Typography>
            <Link href={`/plan/${plan.id}`} underline="none">
              View
            </Link>
          </Paper>
        </Grid>
      ))}

      <Drawer
        anchor={"right"}
        open={isNewPlanFormOpen}
        onClose={onCloseNewPlanForm}
      >
        <Box sx={{ p: 4 }}>
          <PlanForm />
        </Box>
      </Drawer>
    </Grid>
  );
};

export default Home;
