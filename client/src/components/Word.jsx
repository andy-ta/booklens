import React from "react";
import { Shape, Rect, Group } from "react-konva";
import { useState } from "react";
import Tooltip from "./Tooltip";
import Portal from "./Portal";

export default function Word({ text, vertices }) {
    const origin = vertices[0];
    const [isSelected, setIsSelected] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    return (
        <Group {...origin}>
            <Shape
                // fill="white"
                sceneFunc={(context, shape) => {
                    context.beginPath();
                    context.lineTo(
                        vertices[0].x - origin.x,
                        vertices[0].y - origin.y
                    );
                    context.lineTo(
                        vertices[1].x - origin.x,
                        vertices[1].y - origin.y
                    );
                    context.lineTo(
                        vertices[2].x - origin.x,
                        vertices[2].y - origin.y
                    );
                    context.lineTo(
                        vertices[3].x - origin.x,
                        vertices[3].y - origin.y
                    );
                    context.closePath();
                    // (!) Konva specific method, it is very important
                    context.fillStrokeShape(shape);
                }}
                onClick={event => {
                    console.log(event.evt);
                    setIsSelected(!isSelected);
                    setX(event.evt.clientX);
                    setY(event.evt.clientY);
                }}
                onMouseOver={() => console.log(text)}
            />
            {isSelected && (
                <Portal>
                    <div
                        style={{
                            position: "absolute",
                            top: y,
                            left: x,
                            transform: "translate(-50%, -150%)"
                        }}
                    >
                        <Tooltip />
                    </div>
                </Portal>
            )}
        </Group>
    );
}
