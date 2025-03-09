// utils/FilePondUploader.js
import React from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css'; // Estilos de FilePond

const FilePondUploader = ({ onImageSelect }) => {
  const handleFileChange = (fileItems) => {
    if (fileItems.length > 0) {
      const file = fileItems[0].file;
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result); // Pasamos la imagen seleccionada al componente padre
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FilePond
      allowMultiple={false}
      maxFiles={1}
      acceptedFileTypes={['image/*']}
      onupdatefiles={handleFileChange}
      labelIdle="Arrastra una imagen o haz clic para seleccionar"
    />
  );
};

export default FilePondUploader;
