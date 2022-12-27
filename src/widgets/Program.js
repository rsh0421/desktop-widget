import {useState, useEffect} from 'react';
import TabWidget from '../components/TabWidget';
import './Program.css';

const {api} = window;

const Program = ()=>{
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  
  useEffect(()=>{
    if(loading){
      // api.result('DIRLIST').then((result)=>{
      //   const {list} = result;
      //   setList(list);
      //   console.log(list);
  
      //   setLoading(false);
      // });
    }
  }, [])

  return (
    <>
      <TabWidget>
        <TabWidget.Content title="test1"></TabWidget.Content>
        <TabWidget.Content title="test2"></TabWidget.Content>
        <TabWidget.Content title="test3"></TabWidget.Content>
        <div className="program-setting"><a className="program-setting-button" onClick={()=>{api.popup('PROGRAM')}}><span className="program-setting-button-img"></span></a></div>
      </TabWidget>
    </>
  );
};

export default Program;