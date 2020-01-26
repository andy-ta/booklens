import React from 'react';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import Axios from 'axios';
import b64toBlob from '../utils/b64toBlob';
import { useHistory } from 'react-router-dom';

function CameraView({ setPage, setImage }) {
    const history = useHistory();

    const createPage = dataUri => {
        setImage(dataUri);
        const formData = new FormData();
        const blob = b64toBlob(dataUri.substr(22), 'image/png');
        formData.append('image', blob);
        // const blobUrl = URL.createObjectURL(blob)

        Axios.post('/api/pages', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
            console.log(res.data);
            setPage(res.data);
            history.push('/page/' + res.data.id);
        });
    };

    return (
        <Camera
            onTakePhoto={dataUri => createPage(dataUri)}
            idealFacingMode={FACING_MODES.REAR}
            isImageMirror={false}
            // isFullscreen
            // isMaxResolution
        />
    );
}

export default CameraView;
