import { useState, useCallback } from "react";

const useImagePreview = () => {
  const [images, setImages] = useState({});

  const handleImageChange = useCallback((name, file) => {
    setImages((prev) => {
      if (prev[name]?.preview) {
        URL.revokeObjectURL(prev[name].preview);
      }
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        return {
          ...prev,
          [name]: { file, preview: previewUrl },
        };
      }
      return {
        ...prev,
        [name]: { file: null, preview: null },
      };
    });
  }, []);

  const clearImage = useCallback((name) => {
    setImages((prev) => {
      if (prev[name]?.preview) {
        URL.revokeObjectURL(prev[name].preview);
      }
      const updatedImages = { ...prev };
      delete updatedImages[name];
      return updatedImages;
    });
  }, []);

  return {
    images,
    handleImageChange,
    clearImage,
  };
};

export { useImagePreview };
