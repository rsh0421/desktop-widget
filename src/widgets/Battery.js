import {useState, useEffect} from 'react';
import {ProgressBar} from 'react-bootstrap';
import Widget from '../components/Widget';

const {api} = window;


const Battery = ()=>{
  const [status, setStatus] = useState(0);
  const [charge, setCharge] = useState(0);
  
  useEffect(()=>{
    const interval = setInterval(()=>{
      // const {type, capacity} = api.battery.result();
      // setType(type);
      // setCapacity(capacity);

      api.result('BATTERY').then((result)=>{
        const {info} = result;
        setStatus(info.status);
        setCharge(info.charge);
      });
      
    }, 2000);

    return ()=>{
      clearInterval(interval);  
    }
  })

  return (
    <Widget title="Battery">
      <div>Status: {status}</div>
      <div>Capacity: {charge}%</div>
      <div><ProgressBar now={charge}/></div>
    </Widget>
  );
};

export default Battery;