import { useRef } from "react";
import KeyValue from "./KeyValue";
import useClipboardCopy from '../hooks/useClipboardCopy';

interface SelectionProps {
  data: JSONValue;
  path: string;
}

const Selection: React.FC<SelectionProps> = ({data, path}) => {
  const outputRef = useRef<HTMLPreElement | null>(null);
  const { copyToClipboard, copied } = useClipboardCopy(outputRef);
  return (
    <div className="selection">
      <button onClick={copyToClipboard}>Copy to Clipboard</button>
      {copied && <div className="copied-indicator">Copied!</div>}
      <h2><code>{path}</code></h2>
      <pre ref={outputRef}>
        <KeyValue
          keyPath=""
          objectKey=""
          value={data}
          nestingLevel={0}
        />
      </pre>
    </div>
  );
};

export default Selection;