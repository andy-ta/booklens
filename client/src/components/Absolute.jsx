import React from "react";

export default function Absolute({ top, left, children }) {
    return <div style={{ top, left, position: "absolute" }}>{children}</div>;
}
