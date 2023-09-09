import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Paper,
  Button,
  Drawer,
  Box,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  Tooltip,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  useTheme,
} from "@mui/material";
import AssetForm from "../components/AssetForm";
import { getAssets } from "../services/asset.service";
import { useSelector } from "react-redux";
import {
  FolderOpenOutlined,
  ViewListOutlined,
  ViewModuleOutlined,
} from "@mui/icons-material";
import { getKey, saveKey } from "../utils/storage.utils";
import { useNavigate } from "react-router-dom";
import { generateRandomInt } from "../utils/number.utils";

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
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
      <Card>
        <CardActionArea
          onClick={() =>
            setTimeout(() => navigate(`/asset/${asset.id}/register`), 50)
          }
        >
          <CardContent sx={{ padding: "5px" }}>
            <Typography variant="h6">{asset.name}</Typography>
          </CardContent>
          {asset.thumbnailUrl ? (
            <CardMedia
              component="img"
              height="180"
              sx={{ height: 180, minHeight: 180, maxHeight: 180 }}
              image={asset.thumbnailUrl}
              alt={asset.name}
            />
          ) : (
            <CardMedia
              component="img"
              height="180"
              sx={{
                height: 180,
                minHeight: 180,
                maxHeight: 180,
                objectFit: "cover",
              }}
              image={require("../assets/images/no-image.png")}
            />
          )}
        </CardActionArea>
      </Card>
    </Grid>
  );

  const renderListItem = (asset) => (
    <Grid item xs={12}>
      <Card>
        <CardActionArea
          onClick={() =>
            setTimeout(() => navigate(`/asset/${asset.id}/register`), 50)
          }
        >
          <CardContent>
            <Typography variant="h6">{asset.name}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );

  const renderSkeletonLoading = (count) => {
    const skeletons = [...Array(count).keys()].map((x) =>
      generateRandomInt(35, 80)
    );

    return viewType == "list" ? (
      <>
        {skeletons.map((percentage) => (
          <Grid item xs={12}>
            <Paper>
              <Stack>
                <Box sx={{ padding: 2 }}>
                  <Typography
                    variant="h5"
                    maxWidth={"100%"}
                    width={`${percentage}%`}
                  >
                    <Skeleton />
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </>
    ) : (
      <>
        {skeletons.map((percentage) => (
          <Grid item xs={12} md={4} lg={3}>
            <Paper>
              <Stack>
                <Box sx={{ padding: 1 }}>
                  <Typography
                    variant="h5"
                    maxWidth={"100%"}
                    width={`${percentage}%`}
                  >
                    <Skeleton />
                  </Typography>
                </Box>
                <Skeleton variant="rounded" height={180} />
              </Stack>
            </Paper>
          </Grid>
        ))}
      </>
    );
  };

  return (
    <Grid
      container
      p={2}
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
            sx={{ alignSelf: "stretch" }}
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
                <ViewModuleOutlined fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list">
              <Tooltip title="List">
                <ViewListOutlined fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* <Box>
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
          </Box> */}
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
        renderSkeletonLoading(8)
      )}

      <Drawer
        anchor={"right"}
        open={isNewAssetFormOpen}
        onClose={onCloseNewAssetForm}
      >
        <Box
          sx={{
            width: 440,
            flex: 1,
            height: "100%",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h4" m={2} mb={4}>
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
