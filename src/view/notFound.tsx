import React from "react";

const NotFound = ({ data }: any) => {
    let randomImage = data.map((photo: any) => (
        <img
            key={photo.id}
            src={photo.urls.regular}
            style={{ width: "100%" }}
            alt={
                photo.alt_description ? photo.alt_description : "Unsplash Image"
            }
        />
    ));
    return (
        <>
            <div className="utility-page-content-image-wrapper">
                {randomImage}
            </div>
            <p className="title feature-single-hero">
                We Couldn't Find Anything! Try Again.
            </p>
        </>
    );
};

export default NotFound;
