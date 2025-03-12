import React, { useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

function App() {
  const [image, setImage] = useState<string | null>(null); // FIXED
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // FIXED
    const file = event.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
      generateCaption(imageURL);
    }
  };

  const generateCaption = async (imageURL: string) => {
    // FIXED
    setLoading(true);
    const img = new Image();
    img.src = imageURL;
    img.onload = async () => {
      const model = await mobilenet.load();
      const predictions = await model.classify(img);
      setCaption(predictions[0].className);
      setLoading(false);
    };
  };

  return (
    <div className="container text-center mt-5">
      <div className="card shadow-lg p-4">
        <h1 className="mb-4 text-primary">🚀 AI Image Caption Generator</h1>
        <label className="btn btn-primary">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </label>
        <div className="mt-4">
          {image && (
            <img
              src={image}
              alt="Uploaded"
              className="img-fluid rounded shadow-sm"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          )}
        </div>
        {loading && (
          <div className="mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Generating caption...</span>
            </div>
          </div>
        )}
        {caption && !loading && (
          <h3 className="mt-3 text-success">
            📌 Caption: <strong>{caption}</strong>
          </h3>
        )}
      </div>
    </div>
  );
}

export default App;
