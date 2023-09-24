import React, { useRef } from 'react';
import KeyValue from './KeyValue';
import useClipboardCopy from '../hooks/useClipboardCopy';

interface DisplayProps {
  data: JSONValue;
  nestingLevel?: number;
  onKeyClick?: ([keyPath, value]: [string, JSONValue]) => void;
  selectedKey?: string | null;
}

const Display: React.FC<DisplayProps> = ({
  data,
  nestingLevel = 0,
  onKeyClick,
  selectedKey,
}) => {
  const outputRef = useRef<HTMLPreElement | null>(null);
  const { copyToClipboard, copied } = useClipboardCopy(outputRef);

  return (
    <div className="json-display">
      <button onClick={copyToClipboard}>Copy to Clipboard</button>
      {copied && <div className="copied-indicator">Copied!</div>}
      <pre ref={outputRef}>
        <KeyValue
          keyPath=""
          objectKey=""
          value={data}
          nestingLevel={nestingLevel}
          onKeyClick={onKeyClick}
          selectedKey={selectedKey}
        />
      </pre>
    </div>
  );
};

export default Display;
