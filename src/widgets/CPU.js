import {useState, useEffect} from 'react';
import {ProgressBar} from 'react-bootstrap';
import Widget from '../components/Widget';

const {api} = window;


const CPU = ()=>{
  const [usage, setUsage] = useState(0);
  const [speed, setSpeed] = useState(0);
  
  useEffect(()=>{
    const interval = setInterval(()=>{
      const {usage, speed} = api.cpu.result();
      setUsage(usage);
      setSpeed(speed);
    }, 1000);

    return ()=>{
      clearInterval(interval);  
    }
  })

  return (
    <Widget title="CPU">
      <div>Usage: {usage}%</div>
      <div>Speed: {speed} MHz</div>
      <div><ProgressBar now={usage}/></div>
    </Widget>
  );
};

export default CPU;