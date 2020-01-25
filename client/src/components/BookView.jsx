import React from "react";

function BookView({ image, children }) {
    return (
        <div style={{ position: "relative" }}>
            <img style={{ width: "100%" }} src={image} alt="image" />
            {children}
        </div>
    );
}

export default BookView;
