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
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AssetForm from "../components/AssetForm";
import { getAssets } from "../services/asset.service";
import { useSelector } from "react-redux";
import {
  FolderOpenOutlined,
  Tune,
  ViewListOutlined,
  ViewModuleOutlined,
} from "@mui/icons-material";
import { getKey, saveKey } from "../utils/storage.utils";

const Home = () => {
  const { user } = useSelector((state) => state.account);

  const [anchorEl, setAnchorEl] = useState(null);
  const [assets, setAssets] = useState(null);
  const [isNewAssetFormOpen, setIsNewAssetFormOpen] = useState(false);
  const [viewType, setViewType] = useState(getKey("assetViewType") || "grid");
  const [thumbnailsVisible, setThumbnailsVisible] = useState(
    getKey("assetThumbnailsVisibility") == "false" ? false : true
  );

  useEffect(() => {
    setTimeout(() => loadAssets(), 1000);
  }, [user]);

  const handlePreferencesMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadAssets = () => {
    getAssets(user.companyId).then((data) => setAssets(data || []));
  };

  const onCloseNewAssetForm = () => {
    setIsNewAssetFormOpen(false);
  };

  const toggleViewType = (e, newViewType) => {
    setViewType(newViewType);
    saveKey("assetViewType", newViewType);
  };

  const toggleThumbnailsVisibility = () => {
    const newThumbnailsVisibility = !thumbnailsVisible;
    setThumbnailsVisible(newThumbnailsVisibility);
    saveKey("assetThumbnailsVisibility", newThumbnailsVisibility);
  };

  const renderGridItem = (asset) => (
    <Grid item md={4} lg={3} gap={2} spacing={2}>
      <Link href={`/asset/${asset.id}`} underline="none">
        <Paper elevation={2}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              p: 2,
              m: 0,
            }}
          >
            {asset.name}
          </Typography>
          {thumbnailsVisible && (
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                background: asset.thumbnailUrl
                  ? `url(${asset.thumbnailUrl})`
                  : "#aaa",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                height: "165px",
              }}
            >
              <div style={{ width: 128, height: 128 }}></div>
            </Paper>
          )}
        </Paper>
      </Link>
    </Grid>
  );

  const renderListItem = (asset) => (
    <Grid item xs={12}>
      <Link href={`/asset/${asset.id}`} underline="none">
        <Paper elevation={2} sx={{}}>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            {thumbnailsVisible && (
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
            )}
            <Typography
              variant="h6"
              sx={{
                display: "inline-block",
                p: 2,
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
    <Grid
      container
      p={4}
      spacing={2}
      sx={{
        alignContent: "flex-start",
      }}
    >
      <Grid item xs={12}>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 4,
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
              <Tooltip title="Cards">
                <ViewModuleOutlined />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list">
              <Tooltip title="List">
                <ViewListOutlined />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Box>
            <IconButton
              aria-controls="assets-preferences"
              aria-haspopup="true"
              onClick={handlePreferencesMenu}
            >
              <Tune />
            </IconButton>

            <Menu
              id="assets-preferences"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              keepMounted
            >
              <MenuItem onClick={toggleThumbnailsVisibility}>
                {thumbnailsVisible ? "Hide thumbnails" : "Show thumbnails"}
              </MenuItem>
            </Menu>
          </Box>
        </Stack>
      </Grid>

      {assets ? (
        assets.length == 0 ? (
          <Grid item xs={12}>
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
          </Grid>
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
            New Asset
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
