import { useState } from 'react';
import DOMPurify from 'dompurify';

interface UploadProps {
  onUpload: (data: JSONObject | JSONArray) => void;
}

const Upload: React.FC<UploadProps> = ({ onUpload }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const fileSizeLimit = 1024 * 1024; // 1 MB
    if (file.size > fileSizeLimit) {
      setError('File size exceeds the limit of 1 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(DOMPurify.sanitize(reader.result as string));
        onUpload(json);
        setError(null);
      } catch (error) {
        setError('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="upload">
      <input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} />
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Upload;