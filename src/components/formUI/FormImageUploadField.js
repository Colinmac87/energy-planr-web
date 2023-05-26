import FileUpload from "react-mui-fileuploader";

const FormImageUploadField = ({ field, value, onChange }) => {
  const onFileUploadChanges = (files) => {};
  const onFileUploadError = () => {};

  return (
    <FileUpload
      getBase64={false}
      multiFile={false}
      //   disabled={loading}
      title={field.name}
      header={"Drop file here"}
      leftLabel="or"
      rightLabel="to select file"
      buttonLabel="click here"
      buttonRemoveLabel="Remove all"
      maxFileSize={20}
      maxUploadFiles={field.meta?.maxNoOfFiles || 1}
      maxFilesContainerHeight={357}
      acceptedType={"image/*"}
      onFilesChange={onFileUploadChanges}
      onError={onFileUploadError}
      BannerProps={{
        elevation: 0,
        variant: "outlined",
        sx: { background: "black" },
      }}
      showPlaceholderImage={true}
      onContextReady={(context) => {}}
      PlaceholderGridProps={{ md: 6 }}
      LabelsGridProps={{ md: 6 }}
      ContainerProps={{
        elevation: 0,
        variant: "outlined",
        sx: { p: 1 },
      }}
      placeholderImageDimension={{
        xs: { height: 128 },
        sm: { height: 128 },
        md: { height: 164 },
        lg: { height: 256 },
      }}
    />
  );
};

export default FormImageUploadField;
