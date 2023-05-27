import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  Link,
  Button,
  Drawer,
  Box,
  Stack,
} from "@mui/material";
import AssetForm from "../components/AssetForm";
import { getAssets } from "../services/asset.service";
import { useSelector } from "react-redux";
import { FolderOpenOutlined } from "@mui/icons-material";

const Home = () => {
  const { user } = useSelector((state) => state.account);

  const [isNewAssetFormOpen, setIsNewAssetFormOpen] = useState(false);
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    loadAssets();
  }, [user]);

  const loadAssets = () => {
    getAssets(user.companyId).then((data) => setAssets(data || []));
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
      {assets &&
        (assets.length == 0 ? (
          <Stack
            style={{
              flex: 1,
              alignItems: "center",
              padding: 64,
            }}
          >
            <FolderOpenOutlined sx={{ fontSize: 64, color: "#888" }} />
            <Typography sx={{ color: "#888" }}>No assets yet</Typography>
          </Stack>
        ) : (
          assets.map((asset) => (
            <Grid item xs={12} md={4} lg={3}>
              <Link href={`/asset/${asset.id}`} underline="none">
                <Paper
                  elevation={2}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    background: asset.thumbnailUrl
                      ? `url(${asset.thumbnailUrl})`
                      : "#aaa",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      p: 2,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,0.8))",
                    }}
                  >
                    {asset.name}
                  </Typography>
                  <div style={{ width: 128, height: 128 }}></div>
                </Paper>
              </Link>
            </Grid>
          ))
        ))}

      <Drawer
        anchor={"right"}
        open={isNewAssetFormOpen}
        onClose={onCloseNewAssetForm}
      >
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" mb={4}>
            Create a new asset
          </Typography>
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
