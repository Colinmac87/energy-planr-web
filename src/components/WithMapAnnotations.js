import { saveAnnotations } from "../services/location.service";
import MapView from "./MapView";

const WithMapAnnotations = ({
  mode,
  location,
  data,
  areAnnotationsVisible,
  arePinsVisible,
  onPinPlacement,
}) => {
  const handleSaveAnnotations = (annotations) => {
    saveAnnotations(location.id, annotations);
  };

  return (
    <MapView
      mode={mode || "view"}
      data={data}
      image={location.backgroundMapUrl}
      initialAnnotations={location.annotations?.map((annotation) => ({
        ...annotation,
        coords: JSON.parse(annotation.coords),
      }))}
      areAnnotationsVisible={areAnnotationsVisible}
      arePinsVisible={arePinsVisible}
      onPinPlacement={onPinPlacement}
      onSaveAnnotations={handleSaveAnnotations}
    />
  );
};

export default WithMapAnnotations;
