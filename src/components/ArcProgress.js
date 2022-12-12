import {useState, useEffect, useRef} from 'react';
import './ArcProgress.css'

const ArcProgress = (props)=>{
  const canvasRef = useRef(null);

  const animate = ()=>{
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.strokeStyle='#dddddd';
    context.lineWidth = 4;
    context.arc(130, 130, 100, 0 * Math.PI, 1* Math.PI);
    context.stroke();

    requestAnimationFrame(animate);
  }

  useEffect(()=>{
    //animate();
  })

  return (
    <div className="arc-progress">
      <canvas width="260"  height="260"  className="arc-progress-canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default ArcProgress;