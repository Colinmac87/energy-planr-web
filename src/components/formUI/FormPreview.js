import { Close } from "@mui/icons-material";
import { Box, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import WithFormField from "./WithFormField";

const FormPreview = ({ register, fields, onClose }) => {
  const formGroups = [
    {
      hasFields:
        register.formFields.findIndex((field) => field.group == "none") >= 0,
    },
    ...register.formGroups.map((group) => ({
      ...group,
      hasFields:
        register.formFields.findIndex((field) => field.group == group.key) >= 0,
    })),
  ];

  return (
    <Box
      sx={{
        p: 3,
        height: "100%",
        overflow: "auto",
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Form Preview
        </Typography>
        <IconButton onClick={onClose}>
          <Close fontSize="large" />
        </IconButton>
      </Stack>
      {formGroups
        .filter((group) => group.hasFields == true)
        .map((group) => (
          <Paper sx={{ marginBottom: 2, padding: 2 }}>
            <Stack spacing={1}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">{group.name}</Typography>
                </Grid>
                {register.formFields
                  .filter((field) => field.group == (group.key || "none"))
                  .map((field, i) => (
                    <WithFormField
                      key={i}
                      field={field}
                      value={null}
                      onChange={(v) => {}}
                    />
                  ))}
              </Grid>
              <br />
            </Stack>
          </Paper>
        ))}
    </Box>
  );
};

export default FormPreview;
