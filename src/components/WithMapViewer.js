import { useState } from "react";
import WithMapHeader from "./WithMapHeader";
import FullScreenViewer from "./FullScreenViewer";

const WithMapViewer = ({ location, data }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen)
    return (
      <FullScreenViewer isOpen={isFullscreen} onClose={onToggleFullscreen}>
        <WithMapHeader
          location={location}
          data={data}
          onToggleFullscreen={onToggleFullscreen}
        />
      </FullScreenViewer>
    );

  return (
    <WithMapHeader
      location={location}
      data={data}
      onToggleFullscreen={onToggleFullscreen}
    />
  );
};

export default WithMapViewer;
