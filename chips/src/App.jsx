import { useState } from "react";
import { ChipsInput } from "./components/ChipsInput/ChipsInput";
import './App.scss';

function App() {
  const [value, setValue]=useState([])
  return (
    <div className="App">
      <ChipsInput value={value} onChange={setValue}/>
    </div>
  );
}

export default App;
