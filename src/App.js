import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import Die from "./Die";
import Confetti from "./Confetti";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rolledTimes, setRolledTimes] = useState(0);

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
          {" "}
          <h1 className="title">Tenzies</h1>
          <p className="instructions">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>{" "}
          <div className="die-container">{diceElements}</div>{" "}
        </>
      )}
      {tenzies && <p className="roll-time"> It took {rolledTimes} rolls</p>}

      <button onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      {tenzies && <Confetti />}
    </main>
  );
}
