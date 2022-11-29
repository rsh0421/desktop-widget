import './Widget.css'

const Widget = (props)=>{

  return (
    <div className="widget" onClick={()=>console.log('test')}>
      <h2 className="widget-title">{props.title}</h2>
      <div className="widget-content">{props.children}</div>
    </div>
  );
}

export default Widget;