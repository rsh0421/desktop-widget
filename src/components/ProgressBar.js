import './ProgressBar.css'

const ProgressBar = (props)=>{


  let max = 1 || props.max;
  let width = `${(props.value/max) * 100}%`;

  return (
    <div className="progress-bar">
      <div className="progress-bar-gage" style={{width, backgroundColor:props.color}}></div>
    </div>
  );
}

export default ProgressBar;