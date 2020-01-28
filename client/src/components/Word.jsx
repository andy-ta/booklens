import { Paper } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Group, Shape } from 'react-konva';
import Portal from './Portal';
import Tooltip from './Tooltip';

function Word({
    text,
    id,
    vertices,
    visible,
    setHighlighted,
    sentence,
    scaleX,
    scaleY,
    selectedSentence,
    setSelectedSentence
}) {
    const origin = vertices[0];
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const key = id;
    const [thumbnail, setThumbnail] = useState(null);
    let pressTimer;
    const [pressed, setPressed] = useState(false);
    const [getSentenceAudio, setGetSentenceAudio] = useState(false);
    const [sentenceAudio, setSentenceAudio] = useState(null);
    const [translatedSentence, setTranslatedSentence] = useState(null);
    const lang = localStorage.getItem('lang');

    useEffect(() => {
        if (getSentenceAudio && sentence) {
            console.log(sentence);
            setSentenceAudio(null);
            Axios.post(
                'https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=' +
                    process.env.REACT_APP_TEXT_TO_SPEECH_API_KEY,
                {
                    input: { text: sentence.sentenceString },
                    voice: { languageCode: 'en-US' },
                    audioConfig: {
                        audioEncoding: 'OGG_OPUS'
                    }
                }
            ).then(res => {
                setSentenceAudio(res.data.audioContent);
                setGetSentenceAudio(false);
            });
            Axios.get(
                `../api/translate/sentence/${sentence.id}?target=${lang}`
            ).then(res => {
                // if (res.code === 200) {
                setTranslatedSentence(res.data);
                setSelectedSentence(sentence.sentenceNumber);
                setHighlighted(null);
                // }
            });
        }
    }, [
        getSentenceAudio,
        setSentenceAudio,
        sentenceAudio,
        sentence?.sentenceString,
        lang,
        sentence
    ]);

    return (
        <Group {...origin}>
            <Shape
                class="word"
                fill={visible || selectedSentence ? '#3f51b5' : 'transparent'}
                opacity={0.3}
                sceneFunc={(context, shape) => {
                    context.beginPath();
                    context.lineTo(
                        vertices[0].x * scaleX - origin.x,
                        vertices[0].y * scaleY - origin.y
                    );
                    context.lineTo(
                        vertices[1].x * scaleX - origin.x,
                        vertices[1].y * scaleY - origin.y
                    );
                    context.lineTo(
                        vertices[2].x * scaleX - origin.x,
                        vertices[2].y * scaleY - origin.y
                    );
                    context.lineTo(
                        vertices[3].x * scaleX - origin.x,
                        vertices[3].y * scaleY - origin.y
                    );
                    context.closePath();
                    // (!) Konva specific method, it is very important
                    context.fillStrokeShape(shape);
                }}
                onTouchStart={() => {
                    pressTimer = window.setTimeout(() => {
                        setPressed(true);
                        setGetSentenceAudio(true);
                    }, 1000);
                }}
                onTouchEnd={event => {
                    clearTimeout(pressTimer);
                    if (!pressed) {
                        setHighlighted(visible ? null : key);
                        setSelectedSentence(null);
                    }
                    setX(event.evt.changedTouches[0].clientX);
                    setY(event.evt.changedTouches[0].clientY);
                    setPressed(false);
                    return false;
                }}
                onMouseDown={() => {
                    clearTimeout(pressTimer);
                    pressTimer = window.setTimeout(() => {
                        setPressed(true);
                        setGetSentenceAudio(true);
                    }, 1000);
                }}
                onMouseUp={event => {
                    clearTimeout(pressTimer);
                    if (!pressed) {
                        setHighlighted(visible ? null : key);
                        setSelectedSentence(null);
                    }
                    setX(event.evt.offsetX);
                    setY(event.evt.offsetY);
                    setPressed(false);
                    return false;
                }}
                onMouseOver={() => console.log(text)}
                onDragStart={() => setHighlighted(null)}
            />
            {visible && (
                <Portal>
                    <div
                        style={{
                            position: 'absolute',
                            top: y,
                            left: x,
                            transform: 'translate(-50%, -80%)'
                        }}
                    >
                        <Tooltip
                            word={text}
                            id={id}
                            thumbnail={thumbnail}
                            setThumbnail={setThumbnail}
                        />
                    </div>
                </Portal>
            )}
            {sentenceAudio && selectedSentence && (
                <Portal>
                    <audio
                        controls="controls"
                        autobuffer="autobuffer"
                        autoPlay="autoPlay"
                        style={{ display: 'none' }}
                    >
                        <source
                            src={'data:audio/wav;base64,' + sentenceAudio}
                        />
                    </audio>
                </Portal>
            )}
            {translatedSentence && selectedSentence && lang && (
                <Portal>
                    <Paper
                        elevation={3}
                        style={{
                            position: 'absolute',
                            top: y,
                            left: x,
                            // transform: 'translate(-50%, 50%)',
                            padding: '0 1em',
                            maxWidth: '400px'
                        }}
                    >
                        <p>{translatedSentence}</p>
                    </Paper>
                </Portal>
            )}
        </Group>
    );
}

export default Word;
