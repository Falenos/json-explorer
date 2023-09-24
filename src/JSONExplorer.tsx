import {useState} from 'react';
import Upload from './components/Upload';
import Display from './components/Display';
import Selection from './components/Selection';
import defaultJSONData from "./assets/sample.json";
import './JSONExplorer.css'

const JSONExplorer: React.FC = () => {
  const [JSONData, setJSONData] = useState<JSONObject | JSONArray>(defaultJSONData);
  const [selectedKeyValue, setSelectedKeyValue] = useState<[string, JSONValue]>(['', null]);
  const [path, value] = selectedKeyValue;
  return (
    <div className="app">
      <header className="header">
        <h1>JSON Explorer</h1>
        <Upload onUpload={setJSONData} />
      </header>

      <main className="main">
        <section className="left-section">
          <Display data={JSONData} onKeyClick={setSelectedKeyValue} onEdit={setJSONData}/>
        </section>

        {path && (
          <section className="right-section">
            <Selection data={value} path={path}/>
          </section>
        )}
      </main>
    </div>
  );
};

export default JSONExplorer;

