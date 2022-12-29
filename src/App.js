import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import Die from "./Die";
import Confetti from "./Confetti";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [rolledTimes, setRolledTimes] = useState(0);
  const Ref = useRef(null);
  const [timer, setTimer] = useState("01:00");
  const [tenzies, setTenzies] = useState("game");

const hasWon = (
      dice.every((die) => die.value === dice[0].value) &&
      dice.every((die) => die.isHeld)
    )


  useEffect(() => {
    if (timer !== "00:00" && hasWon) {
        setTenzies("win") 
    } else if (timer === "00:00" && hasWon === false ) {
      setTenzies("lose")
    } else if (timer !== "00:00" && !hasWon) {
      setTenzies("game")
    }
  }, [timer , dice]);


  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    setTimer("00:30");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 30);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  const reset = () => {
    clearTimer(getDeadTime());
  };

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 12; i++) {
      newDice.push({
        id: uuidv4(),
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
      });
    }
    return newDice;
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        if (die.id === id) {
          return { ...die, isHeld: !die.isHeld };
        } else return die;
      })
    );
  }

  function rollDice() {
    if (tenzies === "game") {
      setRolledTimes((oldTime) => oldTime + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld
            ? die
            : {
                id: uuidv4(),
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
              };
        })
      );
    } else {
      setDice(allNewDice());
      setRolledTimes(0);
      setTenzies("game");
      reset();
    }
  }


  const diceElements = dice.map((die) => {
    return (
      <Die
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
      />
    );
  });


  return (
    <>
  {(tenzies === "win") && <Confetti />}
    <main>
      {tenzies === "game" && (
        <>
          <h2 className="count-down"> {timer}</h2>
          <h1 className="title">Tenzi</h1>
          <p className="instructions">
            Roll until all dice are the same. Click
            each die to freeze it at its current value between rolls.
          </p>
          <div className="die-container">{diceElements}</div>
        </>
      )}
      {(tenzies === "win") && <p className="roll-time"> It took {rolledTimes} rolls!</p>}
      {tenzies === "lose" && <p> You're never a loser until you quit trying. Wanna try again? </p> }
      <button onClick={rollDice}>{tenzies === "game" ?  "Roll" : "New Game" }</button>
    </main>
</>
  );
}
