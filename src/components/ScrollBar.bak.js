import React from 'react';

import './ScrollBar.css';

export default class ScrollBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ver: null,
      hor: null,
      activated: false
    };

    this.scrollLines = {
      ver: React.createRef(),
      hor: React.createRef()
    };

    this.scrollButtons = {
      ver: React.createRef(),
      hor: React.createRef()
    };

    this.scrollComponent = React.createRef();
    this.scrollWrap = React.createRef();

    this.onScrollMove = this.onScrollMove.bind(this);
    this.onScrollEnd = this.onScrollEnd.bind(this);

    this.onModify = this.onModify.bind(this);
    this.onWheel = this.onWheel.bind(this);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this._ro_ = new window.ResizeObserver((entries)=>{
      if(!this._isComponentMounted_){ return; }

      entries.forEach(entry => {
        if(entry.target === this.scrollComponent.current){
          const { compWidth, compHeight } = entry.contentRect;

          this._compWidth_ = compWidth;
          this._compHeight_ = compHeight;
        }else if(entry.target === this.scrollWrap.current){
          const { wrapWidth, wrapHeight } = entry.contentRect;

          this._wrapWidth_ = wrapWidth;
          this._wrapHeight_ = wrapHeight;
        }
      });

      this.onModify();
    });

    this._isComponentMounted_ = true;
    window.addEventListener('mousemove', this.onScrollMove);
    window.addEventListener('mouseup', this.onScrollEnd);

    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);
  }

  componentDidMount(){
    this._ro_.observe(this.scrollComponent.current);
    this._ro_.observe(this.scrollWrap.current);
    this.onModify();
  }

  componentWillUnmount(){
    this._isComponentMounted_ = false;
    window.removeEventListener('mousemove', this.onScrollMove);
    window.removeEventListener('mouseup', this.onScrollEnd);

    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  }

  onModify(){
    this.setState(this.modifyExec());
  }

  modifyExec(){
    const componentElement = this.scrollComponent.current,
          wrapElement = this.scrollWrap.current,
          verLineElement = this.scrollLines['ver'].current,
          verButtonElement = this.scrollButtons['ver'].current,
          horLineElement = this.scrollLines['hor'].current,
          horButtonElement = this.scrollButtons['hor'].current;

    if(!componentElement){ return {}; }

    this._compWidth_ = this._compWidth_ || componentElement.clientWidth;
    this._compHeight_ = this._compHeight_ || componentElement.clientHeight;
    
    this._wrapWidth_ = this._wrapWidth_ || wrapElement.clientWidth;
    this._wrapHeight_ = this._wrapHeight_ || wrapElement.clientHeight;

    let ver, hor;

    if(this._compHeight_ < this._wrapHeight_){
      ver = {
        height: (verLineElement.clientHeight * this._compHeight_ / this._wrapHeight_) + 'px',
        top: (componentElement.scrollTop * (verLineElement.clientHeight - verButtonElement.clientHeight) / (this._wrapHeight_ - this._compHeight_)) + 'px'
      };

      const rangeSize = verLineElement.clientHeight - verButtonElement.clientHeight;

      if(ver.height < 0){ ver.height = 0; }
      if(ver.height > rangeSize){ ver.height = rangeSize; }
    }

    if(this._compWidth_ < this._wrapWidth_){
      console.log('test');

      hor = {
        width: (horLineElement.clientHeight * this._compWidth_ / this._wrapWidth_) + 'px',
        left: (componentElement.scrollLeft * (horLineElement.clientWidth - horButtonElement.clientWidth) / (this._wrapWidth_ - this._compWidth_)) + 'px'
      }

      const rangeSize = horLineElement.clientWidth - horButtonElement.clientWidth;
      
      if(hor.width < 0){ hor.width = 0; }
      if(hor.width > rangeSize){ hor.width = rangeSize; }
    }

    this._width_ = undefined;
    this._height_ = undefined;

    return {ver, hor}
  }

  onTouchStart(e){
    const component = this.scrollComponent.current;

    this._touchData_ = {
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      scrollLeft: component.scrollLeft,
      scrollTop: component.scrollTop
    }
  }

  onTouchMove(e){
    if(!this._touchData_ || !this._isComponentMounted_){ return; }

    
    const deltaX = -(e.changedTouches[0].clientX - this._touchData_.startX);
    const deltaY = -(e.changedTouches[0].clientY - this._touchData_.startY);

    const component = this.scrollComponent.current;

    if(deltaX !== 0){ component.scrollLeft = this._touchData_.scrollLeft + deltaX; }
    if(deltaY !== 0){ component.scrollTop = this._touchData_.scrollTop + deltaY; }

    this.onModify();

    return;
  }

  onTouchEnd(e){
    if(this._touchData_ && this._isComponentMounted_){ this._touchData_ = null; }
  }

  onScrollStart(dir, e){
    console.log('start');
    this._data_ = {
      dir,
      elements:{
        component: this.scrollComponent.current,
        wrap: this.scrollWrap.current,
        line: this.scrollLines[dir].current,
        button: this.scrollButtons[dir].current
      }
    }

    const {component, wrap} = this._data_.elements;

    if(dir === 'ver'){
      this._data_.startPos = e.pageY;
      this._data_.startScrollPos = component.scrollTop;
      this._data_.maxScrollPos = wrap.clientHeight - component.clientHeight;
    }else{
      this._data_.startPos = e.pageX;
      this._data_.startScrollPos = component.scrollLeft;
      this._data_.maxScrollPos = wrap.clientHeight - component.clientHeight;
    }

    this.setState({activated: true});
  }

  onScrollMove(e){
    if(!this._data_ || !this._isComponentMounted_){ return; }

    const {dir, startPos, elements, startScrollPos, maxScrollPos} = this._data_;

    let deltaPos;

    if(dir === 'ver'){
      deltaPos = (e.pageY - startPos) * this._data_.maxScrollPos / (elements.line.clientHeight - elements.button.clientHeight);

      let pos = startScrollPos + deltaPos;

      if(pos < 0){ pos = 0; }
      if(pos > maxScrollPos){ pos = maxScrollPos; }

      elements.component.scrollTop = pos;
    }else{
      deltaPos = (e.pageX - startPos) * this._data_.maxScrollPos / (elements.line.clientWidth - elements.button.clientWidth);

      let pos = startScrollPos + deltaPos;

      if(pos < 0){ pos = 0; }
      if(pos > maxScrollPos){ pos = maxScrollPos; }

      elements.component.scrollLeft = pos;
    }

    this.onModify();
  }

  onScrollEnd(e){
    if(this._data_ && this._isComponentMounted_) {console.log('end'); this._data_ = null; this.setState({activated: false}); }
  }

  onScrollLineClick(e){

  }

  onWheel(e){
    e.stopPropagation();

    const component = this.scrollComponent.current;

    if(e.deltaX !== 0){ component.scrollLeft += e.deltaX; }
    if(e.deltaY !== 0){ component.scrollTop += e.deltaY; }

    this.onModify();

    return;
  }

  render(){
    return (
      <div className="scrollbar" {... this.props}>
        <div className="scrollbar-component" style={this.state.style} ref={this.scrollComponent} onWheel={this.onWheel} onTouchStart={this.onTouchStart}>
          <div className="scrollbar-wrap" ref={this.scrollWrap}>
            {this.props.children}
          </div>
        </div>
        <div className={this.state.activated? 'scrollbar-line ver activate' : 'scrollbar-line ver'} style={(this.state.ver)? {visibility:'visible'} : {}} ref={this.scrollLines.ver}>
          <span className="scrollbar-button" style={this.state.ver} onMouseDown={this.onScrollStart.bind(this, 'ver')} ref={this.scrollButtons.ver}/>
        </div>
        <div className={this.state.activated? 'scrollbar-line hor activate' : 'scrollbar-line hor'} style={(this.state.hor)? {visibility:'visible'} : {}} ref={this.scrollLines.hor}>
          <span className="scrollbar-button" style={this.state.hor} onMouseDown={this.onScrollStart.bind(this, 'hor')} ref={this.scrollButtons.hor}/>
        </div>
      </div>
    );
  }
} 