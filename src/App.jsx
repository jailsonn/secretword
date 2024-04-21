// Stados - React Hoock
import { useCallback, useEffect, useState } from "react";

// css
import "./App.css";

// Dados variável, não tem o default vai com chaves
import { wordsList } from "./data/words";

// Componentes
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

// O jogo vai ter trez 3 estagios
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 5

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  // console.log(words);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  // Testando
  // console.log(words);

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // console.log(category);
    // pick a random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    // console.log(word);

    // Obs, retornar como Objeto
    return { word, category };
  }, [words]);

  // Exibir todos os componentes do jogo
  // starts the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLettersStates();


    // pick word and pick category
    const { word, category } = pickWordAndCategory();

    // create an array of letters
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // console.log(word, category);
    // console.log(wordLetters);

    // fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // função para processar a letra que o  usuario digita
  // process the letter input
  const verifyLetter = (letter) => {
    // setGameStage(stages[2].name)
    // console.log(letter);

    const normallizedLetter = letter.toLowerCase();
    // check if letter has already been utillized
    if (
      guessedLetters.includes(normallizedLetter) ||
      wrongLetters.includes(normallizedLetter)
    ) {
      return;
    }

    // push guessed letter or remove a guess
    if (letters.includes(normallizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normallizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normallizedLetter,
      ]);
      // Diminuir as tentativas
      setGuesses((actualGuessedLetters) => actualGuessedLetters - 1);
    }
  };
  // console.log(guessedLetters);
  // console.log(wrongLetters);
  const clearLettersStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLettersStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // check win condition
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)];

    // win condition
    if(guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => actualScore += 100)

      // restart game with new word
      startGame();
    }

    // console.log(uniqueLetters);

  }, [guessedLetters, letters, startGame]);


  //retarts the game
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name);
  };

  return (
    <>
      <div className="App">
        {gameStage === "start" && <StartScreen startGame={startGame} />}
        {gameStage === "game" && (
          <Game
            verifyLetter={verifyLetter}
            pickedWord={pickedWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guessedLetters={guessedLetters}
            wrongLetters={wrongLetters}
            guesses={guesses}
            score={score}
          />
        )}
        {gameStage === "end" && <GameOver retry={retry} score={score} />}
      </div>
    </>
  );
}

export default App;
