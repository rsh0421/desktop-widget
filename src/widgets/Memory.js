import {useState, useEffect} from 'react';
import {ProgressBar} from 'react-bootstrap';
import Widget from '../components/Widget';

const {api} = window;


const Memory = ()=>{
  const [free, setFree] = useState(0);
  const [total, setTotal] = useState(0);
  const [speed, setSpeed] =  useState(0);
  
  useEffect(()=>{
    const interval = setInterval(()=>{
      // const {free, total, percentage} = api.memory.result();
      // setFree(free);
      // setTotal(total);
      // setPercentage(percentage);
      api.result('MEMORY').then((result)=>{
        const {info} = result;
        setSpeed(info.speed);
        setFree(Math.round(info.free * 10 / Math.pow(1024,3))/10);
        setTotal(Math.round(info.total * 10 / Math.pow(1024,3))/10);
        console.log(result);
      });
    }, 1000);

    return ()=>{
      clearInterval(interval);  
    }
  })

  return (
    <Widget title="Memory">
      <div>Speed: {speed} MHz</div>
      <div>{free}/{total}GB ({Math.round(free/total*100)}%)</div>
      <div><ProgressBar now={free/total*100}/></div>
    </Widget>
  );
};

export default Memory;