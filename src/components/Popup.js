import {useEffect} from 'react';
import ScrollBar from './ScrollBar';
import './Popup.css'

const Popup = (props)=>{
  useEffect(()=>{console.log('popup update');}, []);

  return (
    <div className={`popup ${props.on? 'on':'off'}`} onClick={props.onClick}>
      <div className="popup-wrap" onClick={(e)=>{e.preventDefault(); e.stopPropagation(); return;}}>
        <h2 className="popup-title">{props.title}</h2>
        <div className="popup-content">
          <ScrollBar>
            {props.children}
          </ScrollBar>
        </div>
      </div>
    </div>
  );
}

export default Popup;