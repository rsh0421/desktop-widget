import {useState, useEffect} from 'react';
import Widget from '../components/Widget';
import {getColor} from '../lib';
import './Battery.css';

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
      <div><BatteryProgress status={status} value={charge} max={100} color={getColor((100-charge)/100)}/></div>
    </Widget>
  );
};

const BatteryProgress = (props)=>{
  let max = props.max || 1;
  let width = `${(props.value/max) * 100}%`;

  const gageClassName = ['battery-progress-gage'];

  if(props.status === 'charging'){
    gageClassName.push('charge');
  }

  return (
    <div className="battery-progress">
      <div className={gageClassName.join(' ')} style={{width, backgroundColor:props.color}}></div>
      <div className="battery-progress-gage-text">{width}</div>
    </div>
  );
}

export default Battery;