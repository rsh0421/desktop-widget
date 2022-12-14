import {useState, useEffect} from 'react';
import {ProgressBar} from 'react-bootstrap';
import Widget from '../components/Widget';
import './Disk.css'

const {api} = window;


const Partition = (props)=>{
  return (
    <div className="disk-partitions-item">
      <div>{props.name}({props.system})</div>
      <div>{Math.round((props.total - props.free) * 10 / Math.pow(1024,3))/10}/{Math.round(props.total * 10 / Math.pow(1024,3))/10}GB ({Math.round((props.total-props.free)/props.total*100)}%)</div>
      <div><ProgressBar now={(props.total - props.free) /props.total*100}/></div>
    </div>
  )
}

const Disk = ()=>{
  const [name, setName] = useState('');
  const [total, setTotal] = useState(0);
  const [disks, setDisks] =  useState([]);
  
  useEffect(()=>{
    const interval = setInterval(()=>{
      // const {free, total, percentage} = api.memory.result();
      // setFree(free);
      // setTotal(total);
      // setPercentage(percentage);
      api.result('DISK').then((result)=>{
        const {info, disks} = result;
        setName(info.name);
        setTotal(Math.round(info.total * 10 / Math.pow(1024,3))/10);
        setDisks(disks);
        console.log(result);
      });
    }, 1000);

    return ()=>{
      clearInterval(interval);  
    }
  })

  return (
    <Widget title="Disk">
      <div>{name} ({total} GB)</div>
      <div className="disk-partitions">
        {disks && disks.map((item, index)=>{
          return (<Partition key={index} {...item} />);
        })}
      </div>
    </Widget>
  );
};

export default Disk;