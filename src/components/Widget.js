import {useEffect} from 'react';
import './Widget.css';

const Widget = (props)=>{

  useEffect(()=>{}, []);

  return (
    <div className="widget" onClick={()=>console.log('test')}>
      <h2 className="widget-title">{props.title}</h2>
      <div className="widget-content">{props.children}</div>
    </div>
  );
}

export default Widget;