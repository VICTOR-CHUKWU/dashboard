import React, { Children, useEffect } from "react";

export const CloudinaryUploadWidget = ({
  path,
  onFinish,
  title,
  className,
  wId,
  children,
}: {
  [key: string]: any;
}) => {
  useEffect(() => {
    //@ts-ignore
    let myWidget = window?.cloudinary.createUploadWidget(
      {
        cloudName: "nesi",
        uploadPreset: "admins",
        maxFileSize: 3145728,
        folder: `${path}`,
        clientAllowedFormats: ["png", "jpeg", "jpg"],
        showUploadMoreButton: false,
        cropping: true,
        croppingCoordinatesMode: "custom",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          onFinish(result.info);
        }
      }
    );
    if (wId != undefined) {
      //@ts-ignore
      document.getElementById(`${wId}`).addEventListener(
        "click",
        function () {
          myWidget.open();
        },
        false
      );
    }
  }, []);

  return (
    <div
      id={wId}
      className={`btn-outline-info btn ${className ? className : ""}`}
    >
      <>{children && <div>{children}</div>}</>
    </div>
  );
};
