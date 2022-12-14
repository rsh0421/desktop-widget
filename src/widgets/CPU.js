import {useState, useEffect} from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Widget from '../components/Widget';
import 'react-circular-progressbar/dist/styles.css';
import './CPU.css'

const {api} = window;

const mainProgressStyle={rotation:-0.35,pathColor:`rgba(62, 152, 199)`,textColor:'#fff',trailColor:'transparent'};

const Core = (props)=>{
  return (
    <div className="cpu-cores-item">
      <div className="cpu-cores-item-name">CORE {props.index}</div>
      <div className="cpu-cores-item-spec">
        <CircularProgressbarWithChildren value={props.usage} strokeWidth={4} maxValue={100} styles={buildStyles({pathColor:`rgba(${200 * (props.usage/100)}, 80, ${200 * ((100-props.usage)/100)})`,trailColor:'transparent'})}>
          <div style={{width:'85%'}}>
            <CircularProgressbarWithChildren value={props.speed} strokeWidth={4} maxValue={props.max} circleRatio={0.7} styles={buildStyles({rotation:-0.35,pathColor:`rgba(${250 * (props.speed/props.max)}, 80, ${250 * ((props.max-props.speed)/props.max)})`,trailColor:'transparent'})}>
              <div className="cpu-cores-item-speed">{Math.round(props.speed/1000 * 10)/10} GHz</div>
              <div className="cpu-cores-item-usage">{props.usage} %</div>
            </CircularProgressbarWithChildren>
          </div>
        </CircularProgressbarWithChildren>
      </div>
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
        console.log(info);
        setName(info.name);
        setMax(info.maxSpeed);
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
  });

  return (
    <Widget title="CPU">
      <div className="cpu-total">
        <div>{name}</div>
        <div className="cpu-total-spec">
          <CircularProgressbarWithChildren value={usage} strokeWidth={2} maxValue={100} styles={buildStyles({pathColor:`rgba(${200 * (usage/100)}, 80, ${200 * ((100-usage)/100)})`,trailColor:'transparent'})}>
            <div style={{width:'90%'}}>
              <CircularProgressbarWithChildren value={speed} strokeWidth={2} maxValue={max} circleRatio={0.7} styles={buildStyles({rotation:-0.35,pathColor:`rgba(${250 * (speed/max)}, 80, ${250 * ((max-speed)/max)})`,trailColor:'transparent'})}>
                <div className="cpu-total-speed">{Math.round(speed/1000 * 10)/10} GHz</div>
                <div className="cpu-total-usage">{usage} %</div>
              </CircularProgressbarWithChildren>
            </div>
          </CircularProgressbarWithChildren>
        </div>
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