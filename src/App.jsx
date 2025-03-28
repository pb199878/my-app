import { useState } from 'react'
import LandTransferTaxCalculator from './LandTransferTaxCalculator'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LandTransferTaxCalculator></LandTransferTaxCalculator>
    </>
  )
}

export default App
