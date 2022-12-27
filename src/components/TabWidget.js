import { Children, useState } from 'react';
import './TabWidget.css'

const TabWidget = (props)=>{
  const [index, setIndex] = useState(0);
  const arrChildren = Children.toArray(props.children);

  return (
    <div className="tab-widget">
      <div className="tab-widget-head-list">{Children.map(arrChildren, (child, i)=>{
        if(child.type.name !== 'TabContent') return;
        return (<a key={i} className={`tab-widget-head ${(i === index)? 'on': 'off'}`} onClick={()=>setIndex(i)}>{child.props.title}</a>);
      })}</div>
      <div className="tab-widget-content-list">{Children.map(arrChildren, (child, i)=>{
        if(child.type.name === 'TabContent') {
          return (<div key={i} className={`tab-widget-content ${(i === index)? 'on': 'off'}`}>{child}</div>);
        }else{
          return (child);
        }
      })}</div>
    </div>
  );
}

const TabContent = (props)=>{
  return (
    <>
      {props.children}
    </>
  );
}

TabWidget.Content = TabContent;

export default TabWidget;

export const Content = TabContent;