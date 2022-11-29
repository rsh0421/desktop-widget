import {useState, useEffect} from 'react';
import {ProgressBar} from 'react-bootstrap';
import Widget from '../components/Widget';

const {api} = window;


const Battery = ()=>{
  const [type, setType] = useState(0);
  const [capacity, setCapacity] = useState(0);
  
  useEffect(()=>{
    const interval = setInterval(()=>{
      const {type, capacity} = api.battery.result();
      setType(type);
      setCapacity(capacity);
      
    }, 2000);

    return ()=>{
      clearInterval(interval);  
    }
  })

  return (
    <Widget title="Battery">
      <div>Capacity: {capacity}%</div>
      <div><ProgressBar now={capacity}/></div>
    </Widget>
  );
};

export default Battery;