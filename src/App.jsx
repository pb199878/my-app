import { useState } from "react";
import LandTransferTaxCalculator from "./LandTransferTaxCalculator";
import "@fontsource/oswald";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LandTransferTaxCalculator></LandTransferTaxCalculator>
    </>
  );
}

export default App;
