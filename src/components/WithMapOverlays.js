import { addOverlay } from "../services/location.service";
import MapView from "./MapView";

const WithMapOverlays = ({ location, data, arePinsVisible }) => {
  const onDraw = ({ type, coords }) => {
    addOverlay(location.id, {
      type,
      coords,
    });
  };

  return (
    <MapView
      onDraw={onDraw}
      data={data}
      image={location.backgroundMapUrl}
      overlays={location.overlays?.map((overlay) => ({
        ...overlay,
        coords: JSON.parse(overlay.coords),
      }))}
      arePinsVisible={arePinsVisible}
    />
  );
};

export default WithMapOverlays;
