import { useState } from "react";
import type { Example } from "@pact/shared-types";
import { formatDate } from "@pact/shared-utils";
import { useExample } from "@pact/shared-hooks";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const { value } = useExample();
  const [count, setCount] = useState(0);

  const example: Example = {
    id: "1",
    name: "Shared Import Test",
  };

  const today = formatDate(new Date());

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Pact Web App</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Shared example: {example.name}</p>
        <p>Today's date: {today}</p>
        <p>Hook value: {value}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
