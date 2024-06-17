import { useState } from 'react';
import Link from '../Link';


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
      </div>
  )
}

export default App
