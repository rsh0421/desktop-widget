import './App.css';

import CPU from './widgets/CPU';
import Memory from './widgets/Memory';
import Battery from './widgets/Battery';
import Disk from './widgets/Disk';

const App = ()=>{
  return (
    <div className="app">
      <div className="app-grid-left">
        <CPU/>
        <Memory/>
        <Disk/>
        <Battery/>
      </div>
      <div className="app-grid-center"></div>
      <div className="app-grid-right">
      </div>
    </div>
  );
}

export default App;
