import {useState, useEffect} from 'react';
import {ProgressBar} from 'react-bootstrap';
import Widget from '../components/Widget';

const {api} = window;


const Memory = ()=>{
  const [free, setFree] = useState(0);
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] =  useState(0);
  
  useEffect(()=>{
    const interval = setInterval(()=>{
      // const {free, total, percentage} = api.memory.result();
      // setFree(free);
      // setTotal(total);
      // setPercentage(percentage);
      api.result('MEMORY').then((result)=>{
        console.log(result);
      });
    }, 1000);

    return ()=>{
      clearInterval(interval);  
    }
  })

  return (
    <Widget title="Memory">
      <div>{free}/{total}GB ({percentage}%)</div>
      <div><ProgressBar now={percentage}/></div>
    </Widget>
  );
};

export default Memory;