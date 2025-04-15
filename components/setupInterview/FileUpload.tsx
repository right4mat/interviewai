import React from 'react';

interface FileUploadProps {
  onFileSelect: (file: File | undefined) => void;
  selectedFile?: File;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    } else if (file) {
      alert('Please upload a PDF file');
      onFileSelect(undefined);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Upload PDF (Optional)
      </label>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {selectedFile && (
          <span className="text-sm text-gray-600">
            {selectedFile.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default FileUpload; 