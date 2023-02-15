import React, { useState, useEffect, useContext } from "react";
import {useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Die from "../Components/Die";
import { Context } from "../Context";
import Confetti from "../Components/Confetti";

export default function Game() {
  const [dice, setDice] = useState(allNewDice());
  const [rolledTimes, setRolledTimes] = useState(0);
  const {timer, tenzies, changeTenzies, changeGameState, seconds, isGameOver} =
    useContext(Context);

  const hasWon =
    dice.every((die) => die.value === dice[0].value) &&
    dice.every((die) => die.isHeld);

  const hasLost = seconds === 0 && !hasWon;

useEffect(() => {
    if (seconds !== 0) {
      changeTenzies(hasWon ? "win" : "game");
    } else {
      changeTenzies("lose");
    }

    if (isGameOver) {
      changeGameState(true);
    }
  }, [dice, isGameOver, seconds]);

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

const navigate = useNavigate(); 
const redirect = () => {
    console.log('redirecting');
   navigate('/')
}

  function rollDice() {
    if (tenzies === "game") {
      setRolledTimes((prevTime) => prevTime + 1);
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
      redirect()
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
      {hasWon && <Confetti />}
      <main>
        {hasWon && (
          <p className="roll-time"> It took {rolledTimes} rolls!</p>
        )}
        {tenzies === "game" && (
          <>
            {timer}
            <h1 className="title">Tenzi</h1>
            <p className="instructions">
              Roll until all dice are the same. Click each die to freeze it at
              its current value between rolls.
            </p>
            <div className="die-container">{diceElements}</div>
          </>
        )}
        {hasLost  && (
          <p> You're never a loser until you quit trying. Wanna try again? </p>
        )}
        <button onClick={rollDice}>
          {tenzies === "game" ?  "Roll" : "New Game" }
        </button>
      </main>
    </>
  );
}
