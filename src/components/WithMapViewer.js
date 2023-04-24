import { useState } from "react";
import WithMapHeader from "./WithMapHeader";
import FullScreenViewer from "./FullScreenViewer";

const WithMapViewer = ({ data, level, asset }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen)
    return (
      <FullScreenViewer isOpen={isFullscreen} onClose={onToggleFullscreen}>
        <WithMapHeader data={data} onToggleFullscreen={onToggleFullscreen} />
      </FullScreenViewer>
    );

  return <WithMapHeader data={data} onToggleFullscreen={onToggleFullscreen} />;
};

export default WithMapViewer;
