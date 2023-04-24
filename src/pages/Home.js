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
import AssetForm from "../components/AssetForm";
import { v4 } from "uuid";

const assets = [
  {
    id: v4(),
    name: "Microsoft head office",
  },
  {
    id: v4(),
    name: "Gymshark building",
  },
  {
    id: v4(),
    name: "Oraan site",
  },
];

const Home = () => {
  const [isNewAssetFormOpen, setIsNewAssetFormOpen] = useState(false);

  const onCloseNewAssetForm = () => {
    setIsNewAssetFormOpen(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h3" component="div">
          Assets
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={() => setIsNewAssetFormOpen(true)}>
          New Asset
        </Button>
      </Grid>
      {assets.map((asset) => (
        <Grid item xs={12} md={4} lg={3}>
          <Link href={`/asset/${asset.id}`} underline="none">
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography gutterBottom variant="h6" component="div">
                {asset.name}
              </Typography>
              <img src="http://placekitten.com/g/512/256" />
            </Paper>
          </Link>
        </Grid>
      ))}

      <Drawer
        anchor={"right"}
        open={isNewAssetFormOpen}
        onClose={onCloseNewAssetForm}
      >
        <Box sx={{ p: 4 }}>
          <AssetForm />
        </Box>
      </Drawer>
    </Grid>
  );
};

export default Home;
