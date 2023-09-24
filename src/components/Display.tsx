import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
// import debounce from 'lodash/debounce';
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { copyToClipboard, copied } = useClipboardCopy(outerRef);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(DOMPurify.sanitize(JSON.stringify(data, null, 2)));
  const [isValidJSON, setIsValidJSON] = useState<boolean>(true);

  const parsedDataRef = useMemo(() => data, [data]);

  useEffect(() => {
    setInputValue(DOMPurify.sanitize(JSON.stringify(data, null, 2)));
  }, [data]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const sanitizedInputValue = useMemo(() => DOMPurify.sanitize(inputValue), [inputValue]);

  const validateJSON = useCallback(() => {
    try {
      JSON.parse(sanitizedInputValue);
      setIsValidJSON(true);
    } catch (e) {
      setIsValidJSON(false);
    }
  }, [sanitizedInputValue]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    validateJSON();
  }, [validateJSON]);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidJSON) {
      const parsedData = JSON.parse(sanitizedInputValue);
      onEdit?.(parsedData);
    }
    setIsEditing(false);
  }, [onEdit, sanitizedInputValue, isValidJSON]);

  const handleCancel = useCallback(() => {
    const dataToCompare = JSON.stringify(parsedDataRef, null, 2);
    if (inputValue !== dataToCompare) {
      if (window.confirm('Are you sure you want to discard your changes?')) {
        setInputValue(dataToCompare);
        setIsValidJSON(true);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
      setIsValidJSON(true);
    }
  }, [inputValue, parsedDataRef]);

  const handleFileDownload = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(sanitizedInputValue);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "data.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [sanitizedInputValue]);

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
          {isEditing && (
            <div className="textarea-info">
              <hr />
              <div className={`character-count ${isValidJSON ? '' : 'invalid'}`}>{inputValue.length} / {'1 billion chars'}</div>
              {isValidJSON ? <div className="success-message">Valid JSON</div> : <div className="error invalid">Invalid JSON</div>}
              <hr />
            </div>
          )}
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
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter JSON data here"
              title="Edit JSON data"
              rows={40}
              style={{width: '100%'}}
              maxLength={1000000000}
            />
          )}
        </pre>
      </form>
    </div>
  );
};

export default Display;