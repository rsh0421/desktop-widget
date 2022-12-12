import {useState, useEffect} from 'react';
import {ProgressBar} from 'react-bootstrap';
import Widget from '../components/Widget';
import './CPU.css'

const {api} = window;

const Core = (props)=>{
  return (
    <div className="cpu-cores-item">
      <div>CORE {props.index}</div>
      <div>Usage: {props.usage}%</div>
      <div><ProgressBar now={props.usage}/></div>
      <div>Speed: {props.speed} MHz</div>
      <div><ProgressBar now={props.speed} max={props.max}/></div>
    </div>
  );
}

const CPU = ()=>{
  const [name, setName] = useState('0');
  const [max, setMax] = useState(0);
  const [usage, setUsage] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [cores, setCores] = useState([]);

  useEffect(()=>{
    const interval = setInterval(()=>{
      //const {usage, speed} = api.cpu.result();
      api.result('CPU').then((result)=>{
        const {info, cores, total} = result;
        setName(info.name);
        setMax(info.max);
        setUsage(total.usage);
        setSpeed(total.speed);
        setCores(cores);
      })
      //setUsage(usage);
      //setSpeed(speed);
    }, 1000);

    return ()=>{
      clearInterval(interval);  
    }
  })

  return (
    <Widget title="CPU">
      <div className="cpu-total">
        <div>{name}</div>
        <div>Usage: {usage}%</div>
        <div><ProgressBar now={usage}/></div>
        <div>Speed: {speed} MHz</div>
        <div><ProgressBar now={speed} max={max}/></div>
      </div>
      <div className="cpu-cores">
        {cores && cores.map((item, index)=>{
          return (<Core key={index} index={index} {...item} max={max} />);
        })}
      </div>
    </Widget>
  );
};

export default CPU;