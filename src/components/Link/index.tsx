import { useState } from 'react';


function Link(props: { onCountClick: (num: number) => void}) {
  const [count, setCount] = useState(0);
  console.log('render Link');
  const handleClick = () => {
    setCount(count + 1);
    props.onCountClick(count + 1)
  }
  return (
    <div onClick={handleClick}>
      {count}
    </div>
  );
}

export default Link;
