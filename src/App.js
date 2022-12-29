import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import Die from "./Die";
import Confetti from "./Confetti";
import Fail from "./Fail";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rolledTimes, setRolledTimes] = useState(0);
  const Ref = useRef(null);
  const [timer, setTimer] = useState("00:00");

  /*
 the function returns an object containing 
the total number of milliseconds remaining, 
as well as the number of minutes and seconds remaining.
*/

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
    setTimer("00:10");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 10);
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
    for (let i = 0; i < 10; i++) {
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
    if (!tenzies) {
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
      setTenzies(false);
      reset();
    }
  }

  useEffect(() => {
    if (
      dice.every((die) => die.value === dice[0].value) &&
      dice.every((die) => die.isHeld)
    ) {
      return setTenzies(true);
    }
  }, [dice]);

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
    <main>
      {!tenzies && (
        <>
          <h2 className="count-down"> {timer}</h2>
          <h1 className="title">Tenzi</h1>
          <p className="instructions">
            Tenzi is a fun dice game. Roll until all dice are the same. Click
            each die to freeze it at its current value between rolls.
          </p>
          <div className="die-container">{diceElements}</div>
        </>
      )}
      {tenzies && <p className="roll-time"> It took {rolledTimes} rolls</p>}
      <button onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      {tenzies && <Confetti />}
    </main>
  );
}
