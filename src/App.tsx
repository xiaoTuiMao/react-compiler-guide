import { useState } from 'react';
import Link from './components/Link';
import Comp1 from './components/Comp1';
import Comp2 from './components/Comp2';
import Comp3 from './components/Comp3';
import Comp4 from './components/Comp4';
import Comp5 from './components/Comp5';
import Comp6 from './components/Comp6';
import Comp7 from './components/Comp7';
import Comp8 from './components/Comp8';
import Comp9 from './components/Comp9';
import Comp10 from './components/Comp10';
import Comp11 from './components/Comp11';
import Comp12 from './components/Comp12';
import Comp13 from './components/Comp13';
import Comp14 from './components/Comp14';
import Comp15 from './components/Comp15';
import Comp16 from './components/Comp16';
import Comp17 from './components/Comp17';
import Comp18 from './components/Comp18';
import Comp19 from './components/Comp19';
import './App.css'


const linkList = [{ id: 1, linkInfo: { text: '这是链接1', address: 'https://www.baidu.com/1' }}, { id: 2, linkInfo: { text: '这是链接2', address: 'https://www.baidu.com/2' }}];
function App() {
  console.log('APP render');
  const [linkId, setLinkId] = useState(1);
  const [random, setRandom] = useState(Math.random());
  const linkInfo = linkList.find((item) => item.id === linkId)?.linkInfo;

  return (
      <div id="container">
        <div id="text1" onClick={() => {
          setLinkId(linkId === 1 ? 2 : 1)
        }}>当前 linkId 为：{linkId}</div>
        <Link linkInfo={linkInfo} onLinkClick={(link: string) => { console.log('====', link)}} />
        <div id="text2" onClick={() => {
          setRandom(Math.random())
        }}>这是一个随机数：{random}</div>
        <div id="text3">这是一段关于 link Id 的介绍</div>
        <Comp1 />
        <Comp2 />
        <Comp3 />
        <Comp4 />
        <Comp5 />
        <Comp6 />
        <Comp7 />
        <Comp8 />
        <Comp9 />
        <Comp10 />
        <Comp11 />
        <Comp12 />
        <Comp13 />
        <Comp14 />
        <Comp15 />
        <Comp16 />
        <Comp17 />
        <Comp18 />
        <Comp19 />
      </div>
  )
}

export default App
