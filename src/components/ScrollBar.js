import {useRef, useState, useEffect} from 'react';

import './ScrollBar.css'

const ScrollBar = (props)=>{
  const [ver, setVer] = useState(null);
  const [hor, setHor] = useState(null);
  const [activated, setActivated] = useState(false);
  const [info, setInfo] = useState({
    compWidth: null,
    compHeight: null,
    wrapWidth: null,
    wrapHeight: null,
    width: null,
    height: null
  });

  const [touch, setTouch] = useState({
    isTouch: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0
  });

  const [scroll, setScroll] = useState({
    isScroll: false,
    dir: null,
    elements: {
      component: 0,
      wrap: 0,
      line: 0,
      button: 0
    },
    startPos: 0,
    startScrollPos: 0,
    maxScrollPos: 0
  });
  
  const scrollLines = {
    ver: useRef(),
    hor: useRef()
  };

  const scrollButtons = {
    ver: useRef(),
    hor: useRef()
  };

  const scrollComponent = useRef();
  const scrollWrap = useRef();

  let isComponentMounted = true;

  const modifyExec = ()=>{
    const componentElement = scrollComponent.current;
    const wrapElement = scrollWrap.current;
    const verLineElement = scrollLines['ver'].current;
    const verButtonElement = scrollButtons['ver'].current;
    const horLineElement = scrollLines['hor'].current;
    const horButtonElement = scrollButtons['hor'].current;
  
    if(!componentElement){
      return {};
    }
  
    info.compWidth = info.compWidth || componentElement.clientWidth;
    info.compHeight = info.compHeight || componentElement.clientHeight;
    
    info.wrapWidth = info.wrapWidth || wrapElement.clientWidth;
    info.wrapHeight = info.wrapHeight || wrapElement.clientHeight;
  
    let ver, hor;
  
    if(info.compHeight < info.wrapHeight){
      ver = {
        height: (verLineElement.clientHeight * info.compHeight / info.wrapHeight) + 'px',
        top: (componentElement.scrollTop * (verLineElement.clientHeight - verButtonElement.clientHeight) / (info.wrapHeight - info.compHeight)) + 'px'
      };
  
      const rangeSize = verLineElement.clientHeight - verButtonElement.clientHeight;
  
      if(ver.height < 0){ ver.height = 0; }
      if(ver.height > rangeSize){ ver.height = rangeSize; }
    }
  
    if(info.compWidth < info.wrapWidth){
      hor = {
        width: (horLineElement.clientHeight * info.compWidth / info.wrapWidth) + 'px',
        left: (componentElement.scrollLeft * (horLineElement.clientWidth - horButtonElement.clientWidth) / (info.wrapWidth - info.compWidth)) + 'px'
      }
  
      const rangeSize = horLineElement.clientWidth - horButtonElement.clientWidth;
      
      if(hor.width < 0){ hor.width = 0; }
      if(hor.width > rangeSize){ hor.width = rangeSize; }
    }
  
    info.width = undefined;
    info.height = undefined;
  
    return {ver, hor}
  };

  const onModify = ()=>{
    const {ver, hor} = modifyExec();
    setVer(ver);
    setHor(hor);
    setInfo({...info});
  }

  const onTouchStart = (e)=>{
    const component = scrollComponent.current;

    touch.isTouch = true;
    touch.startX = e.changedTouches[0].clientX;
    touch.startY = e.changedTouches[0].clientY;
    touch.scrollLeft = component.scrollLeft;
    touch.scrollTop = component.scrollTop;

    setTouch({...touch});
  }

  const onTouchMove = (e)=>{
    if(!touch.isTouch || !isComponentMounted){ return; }

    
    const deltaX = -(e.changedTouches[0].clientX - touch.startX);
    const deltaY = -(e.changedTouches[0].clientY - touch.startY);

    const component = this.scrollComponent.current;

    if(deltaX !== 0){ component.scrollLeft = touch.scrollLeft + deltaX; }
    if(deltaY !== 0){ component.scrollTop = touch.scrollTop + deltaY; }

    onModify();
  }

  const onTouchEnd = (e)=>{
    if(touch.isTouch && isComponentMounted){
      touch.isTouch = false;
      setTouch({...touch});
    }
  }

  const onScrollStart = (dir, e)=>{
    scroll.isScroll = true;
    scroll.dir = dir;
    scroll.elements = {
      component: scrollComponent.current,
      wrap: scrollWrap.current,
      line: scrollLines[dir].current,
      button: scrollButtons[dir].current
    };

    const {component, wrap} = scroll.elements;

    if(dir === 'ver'){
      scroll.startPos = e.pageY;
      scroll.startScrollPos = component.scrollTop;
      scroll.maxScrollPos = wrap.clientHeight - component.clientHeight;
    }else{
      scroll.startPos = e.pageX;
      scroll.startScrollPos = component.scrollLeft;
      scroll.maxScrollPos = wrap.clientHeight - component.clientHeight;
    }

    setScroll({...scroll});
    setActivated(true);
  }

  const onScrollMove = (e)=>{
    if(!scroll.isScroll || !isComponentMounted){ return; }

    const {dir, startPos, elements, startScrollPos, maxScrollPos} = scroll;

    let deltaPos;

    if(dir === 'ver'){
      deltaPos = (e.pageY - startPos) * maxScrollPos / (elements.line.clientHeight - elements.button.clientHeight);

      let pos = startScrollPos + deltaPos;

      if(pos < 0){ pos = 0; }
      if(pos > maxScrollPos){ pos = maxScrollPos; }

      elements.component.scrollTop = pos;
    }else{
      deltaPos = (e.pageX - startPos) * maxScrollPos / (elements.line.clientWidth - elements.button.clientWidth);

      let pos = startScrollPos + deltaPos;

      if(pos < 0){ pos = 0; }
      if(pos > maxScrollPos){ pos = maxScrollPos; }

      elements.component.scrollLeft = pos;
    }

    onModify();
  }

  const onScrollEnd = (e)=>{
    if(scroll.isScroll && isComponentMounted) {
      scroll.isScroll = false; 
      setActivated(false);
      setScroll({...scroll});
    }
  }

  const onWheel = (e)=>{
    e.stopPropagation();

    const component = scrollComponent.current;

    if(e.deltaX !== 0){ component.scrollLeft += e.deltaX; }
    if(e.deltaY !== 0){ component.scrollTop += e.deltaY; }

    onModify();
  }

  const _ro_ = new window.ResizeObserver((entries)=>{
    if(isComponentMounted){ return; }

    entries.forEach(entry => {
      if(entry.target === scrollComponent.current){
        const { compWidth, compHeight } = entry.contentRect;

        info.compWidth = compWidth;
        info.compHeight = compHeight;
      }else if(entry.target === scrollWrap.current){
        const { wrapWidth, wrapHeight } = entry.contentRect;

        info.wrapWidth = wrapWidth;
        info.wrapHeight = wrapHeight;
      }
    });

    onModify();
  });

  useEffect(()=>{
    window.addEventListener('mousemove', onScrollMove);
    window.addEventListener('mouseup', onScrollEnd);

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    _ro_.observe(scrollComponent.current);
    _ro_.observe(scrollWrap.current);

    return ()=>{
      window.removeEventListener('mousemove', onScrollMove);
      window.removeEventListener('mouseup', onScrollEnd);

      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [ver, hor, activated]);


  return(
    <div className="scrollbar" {... props}>
        <div className="scrollbar-component" ref={scrollComponent} onWheel={onWheel} onTouchStart={onTouchStart}>
          <div className="scrollbar-wrap" ref={scrollWrap}>
            {props.children}
          </div>
        </div>
        <div className={activated? 'scrollbar-line ver activate' : 'scrollbar-line ver'} style={(ver)? {visibility:'visible'} : {}} ref={scrollLines.ver}>
          <span className="scrollbar-button" style={ver} onMouseDown={(e)=>{onScrollStart('ver', e)}} ref={scrollButtons.ver}/>
        </div>
        <div className={activated? 'scrollbar-line hor activate' : 'scrollbar-line hor'} style={(hor)? {visibility:'visible'} : {}} ref={scrollLines.hor}>
          <span className="scrollbar-button" style={hor} onMouseDown={(e)=>{onScrollStart('hor', e)}} ref={scrollButtons.hor}/>
        </div>
      </div>
  );
}

export default ScrollBar;