import { useRef, useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import KeyValue from './KeyValue';
import useClipboardCopy from '../hooks/useClipboardCopy';

interface DisplayProps {
  data: JSONObject | JSONArray;
  nestingLevel?: number;
  onKeyClick?: ([keyPath, value]: [string, JSONValue]) => void;
  selectedKey?: string | null;
  onEdit?: (newData: JSONObject | JSONArray) => void;
}

const Display: React.FC<DisplayProps> = ({
  data,
  nestingLevel = 0,
  onKeyClick,
  selectedKey,
  onEdit,
}) => {
  const outerRef = useRef<HTMLPreElement | null>(null);
  const { copyToClipboard, copied } = useClipboardCopy(outerRef);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(DOMPurify.sanitize(JSON.stringify(data, null, 2)));
  const [isValidJSON, setIsValidJSON] = useState<boolean>(true);

  useEffect(() => {
    setInputValue(DOMPurify.sanitize(JSON.stringify(data, null, 2)));
  }, [data]);

  function validateJSON(jsonString: string): boolean {
    try {
      const sanitizedInputValue = DOMPurify.sanitize(jsonString);
      validateJSON.parsed = JSON.parse(sanitizedInputValue);
      setIsValidJSON(true);
      return true;
    } catch (e) {
      setIsValidJSON(false);
      validateJSON.parsed = data;
      return false;
    }
  }
  validateJSON.parsed = data;

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    validateJSON(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    validateJSON(inputValue);
    if (isValidJSON) {
      setIsEditing(false);
      onEdit?.(validateJSON.parsed);
    }
  };

  const handleCancel = () => {
    // console.log('inputValue', JSON.parse(inputValue)?.hasError , JSON.parse(JSON.stringify(data, null, 2))?.hasError);
    const dataToCompare = JSON.stringify(data, null, 2);
    if (inputValue !== dataToCompare) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        setIsEditing(false);
        setInputValue(dataToCompare);
        setIsValidJSON(true);
      }
    } else {
      setIsEditing(false);
      setIsValidJSON(true);
    }
  };

  const handleFileDownload = () => {
    const sanitizedInputValue = DOMPurify.sanitize(inputValue);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(sanitizedInputValue);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="json-display">
      <form onSubmit={handleSubmit}>
        <div className="button-container"> 
          {!isEditing && <button type="button" onClick={() => setIsEditing(true)} title="Edit JSON data">Edit</button>}
          {isEditing && <button type="submit" title="Save JSON data">
            Save
          </button>}
          {isEditing && <button type="button" onClick={handleCancel} title="Cancel editing">
            Cancel
          </button>}
          <button onClick={copyToClipboard} title="Copy JSON to Clipboard">
            Copy to Clipboard
          </button>
          <button onClick={handleFileDownload} title="Download JSON data">
            Download
          </button>
          {copied && <div className="copied-indicator">Copied!</div>}
        </div>
        <pre className="json-container" ref={outerRef}>
          {!isEditing && (
            <KeyValue
              keyPath=""
              objectKey=""
              value={data}
              nestingLevel={nestingLevel}
              onKeyClick={onKeyClick}
              selectedKey={selectedKey}
            />
          )}
          {isEditing && (
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter JSON data here"
              title="Edit JSON data"
              rows={40}
              style={{width: '100%'}}
            />
          )}
        </pre>
        {isEditing && (
          <div className="textarea-info">
            <div className={`character-count ${isValidJSON ? '' : 'invalid'}`}>{inputValue.length} / {200000}</div>
            {isValidJSON ? <div className="success-message">Valid JSON</div> : <div className="error invalid">Invalid JSON</div>}
          </div>
        )}
      </form>
    </div>
  );
};

export default Display;