import './App.css';

import CPU from './widgets/CPU';
import Memory from './widgets/Memory';
import Battery from './widgets/Battery';
import Disk from './widgets/Disk';
import DirList from './widgets/DirList';
import Program from './widgets/Program';

const App = ()=>{
  return (
    <div className="app">
      <div className="app-grid-left">
        <CPU/>
        <Memory/>
        <Disk/>
        <Battery/>
      </div>
      <div className="app-grid-center">
        <DirList/>
        <Program/>
      </div>
      <div className="app-grid-right">
      </div>
    </div>
  );
}

export default App;
