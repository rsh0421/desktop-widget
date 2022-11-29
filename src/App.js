import './App.css';

import CPU from './widgets/CPU';
import Memory from './widgets/Memory';
import Battery from './widgets/Battery';

const App = ()=>{
  return (
    <div className="app">
      <div className="app-grid-left">
        <CPU/>
        <Memory/>
        <Battery/>
      </div>
      <div className="app-grid-center"></div>
      <div className="app-grid-right"></div>
    </div>
  );
}

export default App;
