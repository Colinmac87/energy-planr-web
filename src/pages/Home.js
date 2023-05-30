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
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
} from "@mui/material";
import AssetForm from "../components/AssetForm";
import { getAssets } from "../services/asset.service";
import { useSelector } from "react-redux";
import {
  FolderOpenOutlined,
  ViewListOutlined,
  ViewModuleOutlined,
} from "@mui/icons-material";

const Home = () => {
  const { user } = useSelector((state) => state.account);

  const [isNewAssetFormOpen, setIsNewAssetFormOpen] = useState(false);
  const [viewType, setViewType] = useState("grid");
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    setTimeout(() => loadAssets(), 1000);
  }, [user]);

  const loadAssets = () => {
    getAssets(user.companyId).then((data) => setAssets(data || []));
  };

  const onCloseNewAssetForm = () => {
    setIsNewAssetFormOpen(false);
  };

  const toggleViewType = (e, newViewType) => {
    setViewType(newViewType);
  };

  const renderGridItem = (asset) => (
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
            "&:hover": {
              boxShadow: "0px 0px 2px 4px #fff",
            },
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              p: 2,
              background:
                "linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,0.5))",
            }}
          >
            {asset.name}
          </Typography>
          <div style={{ width: 128, height: 128 }}></div>
        </Paper>
      </Link>
    </Grid>
  );

  const renderListItem = (asset) => (
    <Grid item xs={12}>
      <Link href={`/asset/${asset.id}`} underline="none">
        <Paper
          elevation={2}
          sx={{
            "&:hover": {
              boxShadow: "0px 0px 2px 4px #fff",
            },
          }}
        >
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: 6,
                display: "inline-block",
                width: 128,
                height: 128,
                background: asset.thumbnailUrl
                  ? `url(${asset.thumbnailUrl})`
                  : "#aaa",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></Box>
            <Typography
              variant="h6"
              sx={{
                display: "inline-block",
                p: 0,
                m: 0,
              }}
            >
              {asset.name}
            </Typography>
          </Stack>
        </Paper>
      </Link>
    </Grid>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography gutterBottom variant="h3" component="div">
          Assets
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setIsNewAssetFormOpen(true)}
          >
            New Asset
          </Button>
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={toggleViewType}
          >
            <ToggleButton value="grid">
              <ViewModuleOutlined />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListOutlined />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Grid>

      {assets ? (
        assets.length == 0 ? (
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
          assets.map((asset) =>
            viewType == "list" ? renderListItem(asset) : renderGridItem(asset)
          )
        )
      ) : (
        <>
          <Grid item xs={12} md={4} lg={3}>
            <Paper>
              <Stack>
                <Box sx={{ padding: 1 }}>
                  <Skeleton variant="text" />
                </Box>
                <Skeleton variant="rounded" height={128} />
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper>
              <Stack>
                <Box sx={{ padding: 1 }}>
                  <Skeleton variant="text" />
                </Box>
                <Skeleton variant="rounded" height={128} />
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper>
              <Stack>
                <Box sx={{ padding: 1 }}>
                  <Skeleton variant="text" />
                </Box>
                <Skeleton variant="rounded" height={128} />
              </Stack>
            </Paper>
          </Grid>
        </>
      )}

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
