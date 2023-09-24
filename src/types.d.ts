type JSONPrimitive = string | number | boolean | null;

interface JSONObject {
  [key: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

type JSONValue = JSONPrimitive | JSONObject | JSONArray;