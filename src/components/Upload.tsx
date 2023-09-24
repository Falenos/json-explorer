interface UploadProps {
  onUpload: (data: JSONObject) => void;
}

const Upload: React.FC<UploadProps> = ({onUpload}) => { 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          try {
            const data = JSON.parse(result);
            onUpload(data);
          } catch (error) {
            console.error(error);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <input type="file" onChange={handleChange}/>
  );
}

export default Upload;