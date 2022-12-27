import { useState, useEffect } from 'react';
import Widget from '../components/Widget';
import ProgressBar from '../components/ProgressBar'
import { getColor } from '../lib';
import './Memory.css';

const {api} = window;

const Memory = ()=>{
  const [usage, setUsage] = useState(0);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [speed, setSpeed] =  useState(0);
  
  useEffect(()=>{
    const interval = setInterval(()=>{
      api.result('MEMORY').then((result)=>{
        const {info} = result;
        setSpeed(Math.round(info.speed/100)/10);
        setCount(info.count);
        setUsage(Math.round((info.total-info.free) * 10 / Math.pow(1024,3))/10);
        setTotal(Math.round(info.total * 10 / Math.pow(1024,3))/10);
      });
    }, 2000);

    return ()=>{
      clearInterval(interval);  
    }
  }, [usage, count, total, speed]);

  let ratio = usage/total;

  return (
    <Widget title="Memory">
      <div>Speed: {speed} GHz / Count: {count}</div>
      <div className="memory-spec">
        <div>{usage} / {total} GB ({Math.round(ratio*100)} %)</div>
        <div><ProgressBar value={ratio} color={getColor(ratio)}/></div>
      </div>
    </Widget>
  );
};

export default Memory;