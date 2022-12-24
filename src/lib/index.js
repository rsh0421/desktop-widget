
export const getColor = (ratio)=>{
  const twoTime = ratio * 2.0;

  const minValue = 50;
  const maxValue = 210;

  let rValue = 0;
  let gValue = 0;
  let bValue = 0;

  if(twoTime <= 1){
    rValue = Math.round(minValue + ((maxValue - minValue) * twoTime));
    gValue = maxValue;
    bValue = minValue;
  }else if(twoTime <= 2){
    rValue = maxValue;
    gValue = Math.round(maxValue - ((maxValue - minValue) * (twoTime - 1)));
    bValue = minValue;
  }

  return `rgb(${rValue}, ${gValue}, ${bValue})`;
};