import { useState } from 'react';
import Link from './components/Link';
import './App.css'

function App() {
  "use no memo";
  const [x, setX] = useState(0)
  console.log('render APP');
  return (
      <div>
        <div onClick={() => setX(Math.random())}>{x}</div>
        <Link onCountClick={(x) => { console.log('====', x)}} />
      </div>
  )
}

export default App
