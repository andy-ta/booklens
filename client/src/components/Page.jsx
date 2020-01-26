import { CircularProgress } from '@material-ui/core';
import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Group, Image, Layer, Stage } from 'react-konva';
import { useParams } from 'react-router-dom';
import useImage from 'use-image';
import Word from './Word';

export default function Page({ page, imageUri, setPage, setImage }) {
    const { pageId } = useParams();
    const imageEl = useRef();

    useEffect(() => {
        if (!page && pageId) {
            Axios.get('/api/pages/' + pageId).then(res => {
                console.log(res.data);
                setPage(res.data);
                setImage(`/api/pages/${pageId}/image`);
            });
        }
    }, [page, pageId, setPage, setImage]);

    const [image] = useImage(imageUri);

    const [highlighted, setHighlighted] = useState(null);
    const [selectedSentence, setSelectedSentence] = useState(null);
    const [imageWidth, setImageWidth] = useState(null);
    const [imageHeight, setImageHeight] = useState(null);

    useEffect(() => {
        if (imageEl.current) {
            const dims =
                imageEl.current?.children[0]?.children[0]?.children[0]?.attrs;
            if (dims !== undefined) {
                setImageWidth(dims.width);
                setImageHeight(dims.height);
            }
        }
    });

    if (!page) {
        return (
            <div style={{ width: '100%', textAlign: 'center', margin: 'auto' }}>
                <CircularProgress style={{ margin: '3em auto' }} />
            </div>
        );
    }

    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            ref={imageEl}
        >
            <Layer>
                <Group
                    draggable
                    onMouseDown={event => {
                        if (event.target.attrs.class === 'word') return;
                        setHighlighted(null);
                        setSelectedSentence(null);
                    }}
                    dragBoundFunc={pos => {
                        console.log(pos, window.innerHeight);
                        return {
                            x: 0,
                            y: pos.y > 0 ? 0 : pos.y
                        };
                    }}
                >
                    {image && (
                        <Image
                            image={image}
                            width={
                                window.innerWidth > image.naturalWidth
                                    ? window.innerWidth
                                    : image.naturalWidth
                            }
                            height={
                                window.innerWidth > image.naturalWidth
                                    ? window.innerWidth *
                                      (image.naturalHeight / image.naturalWidth)
                                    : image.naturalWidth *
                                      (image.naturalHeight / image.naturalWidth)
                            }
                        />
                    )}
                    {imageWidth &&
                        imageHeight &&
                        image &&
                        page.sentences
                            .map(sentence => {
                                return sentence.words.map(word => {
                                    return (
                                        <Word
                                            key={word.id}
                                            text={word.word}
                                            vertices={word.vertices}
                                            id={word.id}
                                            sentence={page.sentences.find(
                                                sentence =>
                                                    sentence.sentenceNumber ===
                                                    word.sentenceId
                                            )}
                                            visible={highlighted === word.id}
                                            setHighlighted={setHighlighted}
                                            selectedSentence={
                                                word.sentenceId ===
                                                selectedSentence
                                            }
                                            setSelectedSentence={
                                                setSelectedSentence
                                            }
                                            scaleX={
                                                image
                                                    ? imageWidth /
                                                      image.naturalWidth
                                                    : 1
                                            }
                                            scaleY={
                                                image
                                                    ? imageHeight /
                                                      image.naturalHeight
                                                    : 1
                                            }
                                        />
                                    );
                                });
                            })
                            .flat()}
                </Group>
            </Layer>
        </Stage>
    );
}
