import {useState, useEffect} from 'react';
import Widget from '../components/Widget';
import './DirList.css';

const {api} = window;

const onClick = (name)=>{
  api.result('DIRLIST', name).then((result)=>{
    const {list} = result;
    console.log(list);
  });
}

const DirItem = (props)=>{
  return (
    <div className={`dir-list-item ${props.name}`} onClick={()=>{onClick(props.name)}}>
      <div className="dir-list-item-icon">
        <span className="dir-list-item-icon-img"></span>
      </div>
      <div className="dir-list-item-name">{props.name}</div>
    </div>
  )
}

const Disk = ()=>{
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  
  useEffect(()=>{
    if(loading){
      api.result('DIRLIST').then((result)=>{
        const {list} = result;
        setList(list);
        console.log(list);
  
        setLoading(false);
      });
    }
  }, [loading, list]);

  return (
    <Widget title="Quick Directories" loading={loading}>
      <div className="dir-list">
        {list.map((item, index)=>{
          return (<DirItem key={index} {...item} />);
        })}
      </div>
    </Widget>
  );
};

export default Disk;