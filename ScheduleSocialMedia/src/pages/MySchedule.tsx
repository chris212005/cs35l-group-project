import { useState, useRef } from "react";

interface Props {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "danger";
  onClick?: () => void;
}

const Button = ({ children, color = "primary", onClick }: Props) => {
  return (
    <button className={"btn btn-" + color} onClick={onClick}>
      {children}
    </button>
  );
};

const MySchedule = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [savedImage, setSavedImage] = useState<string | null>(null);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleSaveChanges = () => {
    if (imagePreview) {
      setSavedImage(imagePreview);

      // Show saved messages when user clicks save changes
      setShowSavedMessage(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto pt-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* M Header */}
          <div className="flex items-center gap-6">
            {" "}
            <div className="w-24 h-24 bg-gray-300 rounded-xl"></div>{" "}
          </div>{" "}
          {/* My Schedule Button */}
          {!showUpload && (
            <div className="mt-6">
              <Button
                color="primary"
                onClick={() => {
                  setShowUpload(true);

                  // If no change, keep the previous picture
                  if (savedImage) {
                    setImagePreview(savedImage);
                  }
                }}
              >
                ✏️ Edit My Schedule
              </Button>

              {/* Show saved image under button */}
              {savedImage && (
                <div className="mt-4">
                  <img
                    src={savedImage}
                    alt="Saved Schedule"
                    onClick={() => setShowPreviewModal(true)}
                    style={{
                      width: 200,
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 12,
                    }}
                  />
                </div>
              )}
            </div>
          )}
          {/* Upload Section */}
          {showUpload && (
            <div className="mt-6 border rounded-lg p-6 bg-gray-50 relative">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowUpload(false);
                  setShowSavedMessage(false);
                }}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  backgroundColor: "#1FA64A",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                }}
              >
                X
              </button>

              {/* Image Preview Box */}
              <div className="mb-4">
                <div
                  onClick={() => imagePreview && setShowPreviewModal(true)}
                  style={{
                    width: 160,
                    height: 160,
                    background: "#d1d5db",
                    borderRadius: 20,
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ color: "#6b7280", fontSize: 14 }}>
                      Upload your photo
                    </span>
                  )}
                </div>
              </div>

              {/* File + Reset Column */}
              <div className="flex flex-col items-start gap-2">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                {/*Save Changes and Delete button*/}
                {imagePreview && (
                  <div>
                    <Button color="primary" onClick={() => handleSaveChanges()}>
                      Save Changes
                    </Button>

                    <Button
                      color="danger"
                      onClick={() => {
                        setImagePreview(null);
                        setSavedImage(null);
                        setShowSavedMessage(false);

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      Delete Picture
                    </Button>

                    {showSavedMessage && (
                      <div
                        style={{
                          marginTop: 10,
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        ✅ The image has been saved
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Image Modal Viewer -> Show full screen onClick */}
      {showPreviewModal && (imagePreview || savedImage) && (
        <div
          onClick={() => setShowPreviewModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <img
            src={imagePreview || savedImage || ""}
            alt="Full Preview"
            style={{
              maxWidth: "80%",
              maxHeight: "80%",
              borderRadius: 12,
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      )}
    </div>
  );
};
export default MySchedule;
