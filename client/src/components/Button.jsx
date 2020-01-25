import React from "react";
import { Text, Rect, Group } from "react-konva";
import { useState } from "react";

const CORNER_RADIUS = 5;

export default function Tooltip({ position, children }) {
    const [text, setText] = useState(null);
    let cornerRadius = CORNER_RADIUS;
    console.log(text);

    if (position === "start") {
        cornerRadius = [CORNER_RADIUS, 0, 0, CORNER_RADIUS];
    } else if (position === "end") {
        cornerRadius = [0, CORNER_RADIUS, CORNER_RADIUS, 0];
    }

    return (
        <Group>
            <Rect
                // sceneFunc={(context, shape) => {
                //     context.strokeRect(0, 0, 1000, 1000);
                //     // setText(shape);
                // }}
                text="hello"
                fontFamily="Calibri"
                fontSize={40}
                stroke="red"
                fill="white"
                width={100}
                height={100}
            />

            {/* {text && (
                <Rect
                    fill="#555"
                    width={text.textWidth}
                    height={text.textHeight}
                    cornerRadius={cornerRadius}
                />
            )} */}
        </Group>
    );
}
