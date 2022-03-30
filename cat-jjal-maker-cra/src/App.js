import React from "react";

import Title from './components/Title'
import './App.css';

const OPEN_API_DOMAIN = "https://cataas.com";
const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key, def) => {
    return (localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : def);
  },
};

const fetchCat = async (text) => {
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/cute/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const CatItem = ({img}) => (
  <li>
    <img src={img} style={{width: '150px'}} />
  </li>
)

const Favorites = ({ favorites }) => {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요</div>
  }

  return (
    <ul className="favorites">
      { favorites.map(cat => <CatItem img={cat} key={cat} />) }
    </ul>
  )
}

const MainCard = ({ img, alreadyFavorited, onHeartClick }) => {
  const heartIcon = alreadyFavorited ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{ heartIcon }</button>
    </div>
  )
};
  
const Form = ({updateMainCat}) => {
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

  function handleInputChange(e) {
    const userValue = e.target.value;

    includesHangul(userValue) ? setErrorMessage("한글은 입력할 수 없습니다.") : setErrorMessage('');
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (value === '') {
      setErrorMessage("빈 값으로는 안 돼!");
      return;
    }

    updateMainCat(value);
  }

  return (
    <form onSubmit={ handleFormSubmit }>
      <input 
        type="text" 
        name="name" 
        value={value} 
        placeholder="영어 대사를 입력해주세요" 
        onChange={handleInputChange} 
      />
      <button type="submit" >생성2</button>
      <p style={{color: "red"}}>{errorMessage}</p>
    </form>
  )
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem('counter', 0);
  });

  const [catImage, setCatImage] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem('favorites', []);
  });

  const alreadyFavorited = favorites.includes(catImage);

  async function initMainCat() {
    const newCat = await fetchCat('First CAT')
    setCatImage(newCat);
  }

  React.useEffect(() => {
    initMainCat();
  }, [])

  async function updateMainCat(text) {
    const newCat = await fetchCat(text);

    setCatImage(newCat);
    setCounter((prevCounter) => {
      const nextCounter = prevCounter + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, catImage];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites);
  }

  return (
    <div>
      <Title counter={counter} />
      <Form updateMainCat={updateMainCat} />
      <MainCard img={catImage} alreadyFavorited={alreadyFavorited} onHeartClick={handleHeartClick} />
      <Favorites favorites={favorites} />
    </div>
  )
};

export default App;
