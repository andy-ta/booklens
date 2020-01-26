import { CircularProgress, Fade, Paper } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Tooltip({ word, id, thumbnail, setThumbnail }) {
    const [noImage, setNoImage] = useState(false);
    const [audio, setAudio] = useState(null);
    const [translation, setTranslation] = useState(null);
    const lang = localStorage.getItem('lang');

    useEffect(() => {
        Axios.post(
            'https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=' +
                process.env.REACT_APP_TEXT_TO_SPEECH_API_KEY,
            {
                input: { text: word },
                voice: { languageCode: 'en-US' },
                audioConfig: {
                    audioEncoding: 'OGG_OPUS'
                }
            }
        ).then(res => setAudio(res.data.audioContent));
    }, [word]);

    useEffect(() => {
        if (thumbnail) return;
        Axios.get(`../api/words/${word}/images`).then(res => {
            console.log('DATA', res.data);
            if (res.data === undefined || res.data.length === 0) {
                setNoImage(true);
            } else {
                setThumbnail(res.data.large_thumb?.url);
            }
        });
    }, [word, thumbnail, setThumbnail]);

    useEffect(() => {
        Axios.get(`../api/translate/word/${id}?target=${lang}`).then(res =>
            setTranslation(res.data)
        );
    }, [id, lang]);

    return (
        <>
            {audio && (
                <audio
                    controls="controls"
                    autobuffer="autobuffer"
                    autoPlay="autoPlay"
                    style={{ display: 'none' }}
                >
                    <source src={'data:audio/wav;base64,' + audio} />
                </audio>
            )}
            <Fade in={thumbnail && !noImage} mountOnEnter unmountOnExit>
                <Paper elevation={3}>
                    <img src={thumbnail} alt={word} />
                </Paper>
            </Fade>

            {!thumbnail && !noImage && (
                <div style={{ height: '64px', textAlign: 'center' }}>
                    <CircularProgress />
                </div>
            )}
            <div style={{ height: '24px' }}>
                <Fade in={translation !== null} mountOnEnter unmountOnExit>
                    <div style={{ textAlign: 'center' }}>{translation}</div>
                </Fade>
            </div>
        </>
    );
}
