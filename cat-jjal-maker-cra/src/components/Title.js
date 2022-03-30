const Title = ({ counter }) => {
  const counterText = counter ? `${ counter }번째 ` : null;
  return <h1>{counterText}고양이 가라사대</h1>
}

export default Title;
