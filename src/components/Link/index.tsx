function Link(props: { onLinkClick: (num: string) => void, linkInfo?: { text: string, address: string } }) {
  console.log(`Link Render`);

  const handleClick = () => {
    props.onLinkClick(props.linkInfo?.address ?? '')
  }
  return (
    <div >
      <div onClick={handleClick}>{props.linkInfo?.text}</div>
    </div>
  );
}

export default Link;
