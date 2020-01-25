import React from "react";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

function CameraView({ setImage }) {
    return (
        <Camera
            onTakePhoto={dataUri => setImage(dataUri)}
            idealFacingMode={FACING_MODES.REAR}
            isFullscreen
            isMaxResolution
        />
    );
}

export default CameraView;
