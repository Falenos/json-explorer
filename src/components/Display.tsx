import React, { useRef, useState } from 'react';
import KeyValue from './KeyValue';
import useClipboardCopy from '../hooks/useClipboardCopy';

interface DisplayProps {
  data: JSONValue;
  nestingLevel?: number;
  onKeyClick?: ([keyPath, value]: [string, JSONValue]) => void;
  selectedKey?: string | null;
  onEdit?: (newData: JSONObject) => void;
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
  const [inputValue, setInputValue] = useState<string>(JSON.stringify(data, null, 2));
  const [isValidJSON, setIsValidJSON] = useState<boolean>(true);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    try {
      JSON.parse(event.target.value);
      setIsValidJSON(true);
    } catch (e) {
      setIsValidJSON(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const parsedValue = JSON.parse(inputValue);
      onEdit?.(parsedValue);
      setIsEditing(false);
      setIsValidJSON(true);
    } catch (e) {
      setIsValidJSON(false);
    }
  };

  const handleCancel = () => {
    // console.log('inputValue', JSON.parse(inputValue)?.hasError , JSON.parse(JSON.stringify(data, null, 2))?.hasError);
    if (inputValue !== JSON.stringify(data, null, 2)) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        setInputValue(JSON.stringify(data, null, 2));
        setIsEditing(false);
        setIsValidJSON(true);
      }
    } else {
      setIsEditing(false);
      setIsValidJSON(true);
    }
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
              style={{width: '100%', height: '400px'}}
            />
          )}
        </pre>
        {isEditing && (
          <div className="textarea-info">
            <div className={`character-count ${isValidJSON ? '' : 'invalid'}`}>{inputValue.length} / {10000}</div>
            {isValidJSON ? <div className="success-message">Valid JSON</div> : <div className="error invalid">Invalid JSON</div>}
          </div>
        )}
      </form>
    </div>
  );
};

export default Display;