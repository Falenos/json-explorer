import Ident from './Ident.tsx';

interface KeyValueProps {
  keyPath: string;
  objectKey: string;
  value: JSONValue;
  nestingLevel: number;
  onKeyClick?: ([keyPath, value]: [string, JSONValue]) => void;
  selectedKey?: string | null;
  hasNextSibling?: boolean;
}

const KeyValue: React.FC<KeyValueProps> = ({
  keyPath,
  objectKey,
  value,
  nestingLevel,
  onKeyClick,
  selectedKey,
  hasNextSibling,
}) => {
  const isArray = Array.isArray(value);
  const isEmptyArray = isArray && value.length === 0;
  const isObject = value && typeof value === 'object' && !isArray;
  const isEmptyObject = isObject && Object.keys(value).length === 0;

  const handleClick = () => {
    if (onKeyClick) {
      window.scrollTo(0, 0);
      onKeyClick([keyPath, value]);
    }
  };

  return (
    <div className="key-value-entry">
      {objectKey && <span onClick={handleClick} className={selectedKey === objectKey ? 'selected-key' : 'key'} style={onKeyClick ? {color: 'blue', cursor: 'pointer'} : {}}>
        <Ident level={nestingLevel} />
        "{objectKey}":<>&nbsp;</>
      </span>}
      {isArray && (
        <span className="key-value-array">
          <Ident level={nestingLevel} show={!objectKey}/>{'['}{!isEmptyArray && '\n'}
          {value.map((item: JSONValue, index: number) => (
            <KeyValue
              key={index}
              objectKey={''}
              keyPath={`${keyPath}[${index}]`}
              value={item}
              nestingLevel={nestingLevel + 1}
              onKeyClick={onKeyClick}
              selectedKey={selectedKey}
              hasNextSibling={index < value.length - 1}
            />
          ))}
          <Ident level={nestingLevel} show={!isEmptyArray} />{']'}
        </span>
      )}
      {isObject && (
        <span className="key-value-object">
          <Ident level={nestingLevel} show={!objectKey}/>{'{'}{!isEmptyObject && '\n'}
          {Object.keys(value).map((key) => (
            <KeyValue
              key={key}
              objectKey={key}
              keyPath={keyPath ? `${keyPath}.${key}` : key}
              value={value[key]}
              nestingLevel={nestingLevel + 1}
              onKeyClick={onKeyClick}
              selectedKey={selectedKey}
              hasNextSibling={Object.keys(value).indexOf(key) < Object.keys(value).length - 1}
            />
          ))}
          <Ident level={nestingLevel} show={!isEmptyObject}/>{'}'}
        </span>
      )}
      {!isArray && !isObject && (
        <span className="value"><Ident level={nestingLevel} show={!objectKey}/>{JSON.stringify(value)}</span>
      )}
      {hasNextSibling && <>{','}</>}
      {'\n'}
    </div>
  );
};

export default KeyValue;