import React, { useEffect, useState } from "react";
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
import { getAssets } from "../services/asset.service";

const Home = () => {
  const [isNewAssetFormOpen, setIsNewAssetFormOpen] = useState(false);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = () => {
    getAssets().then((data) => setAssets(data));
  };

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
              {asset.thumbnailUrl && (
                <img
                  src={asset.thumbnailUrl}
                  style={{ maxWidth: 256, maxHeight: 256 }}
                  alt="Failed to load"
                />
              )}
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
          <AssetForm
            onSaving={() => {}}
            onSave={() => {
              onCloseNewAssetForm();
              loadAssets();
            }}
          />
        </Box>
      </Drawer>
    </Grid>
  );
};

export default Home;
