import React from "react";
import { Image, Layer, Stage, Group } from "react-konva";
import useImage from "use-image";
import BookView from "./components/BookView";
import Word from "./components/Word";
import res from "./response";

function App() {
    const [image] = useImage("/fatChick.jpg");

    return (
        <div className="App">
            {/* {image ? ( */}
            <Stage width={window.innerWidth} height={400}>
                <Layer>
                    <Group draggable>
                        <Image image={image} />

                        {res.map(word => (
                            <Word
                                key={word.word}
                                text={word.word}
                                vertices={word.vertices}
                            />
                        ))}
                    </Group>
                </Layer>
            </Stage>
            {/* ) : (
                <></>
                // <CameraView setImage={setImage} />
            )} */}
        </div>
    );
}

export default App;
