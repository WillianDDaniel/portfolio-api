import { useState, useCallback } from 'react';

export function useImagePreview(initialImage: string | null = null) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const clearImage = useCallback(() => {
    setImagePreview(null);
    setSelectedFile(null);
  }, []);

  return {
    imagePreview,
    setImagePreview,
    selectedFile,
    setSelectedFile,
    handleFileChange,
    clearImage
  };
}
