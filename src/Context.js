import React, { useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";
const Context = React.createContext();

function ContextProvider({ children }) {
  const [isGameOver, setIsGameOver] = useState(true);
  const [tenzies, setTenzies] = useState("start");
  const [time, setTime] = useState(30);

  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + time);

  var { seconds, minutes, isRunning, restart, start } = useTimer({
    expiryTimestamp: deadline,
    autoStart: false,
    onExpire: () => setIsGameOver(true),
  });

  useEffect(() => {
    !isGameOver && tenzies === "game" && start(time);
  }, [isGameOver, tenzies, time]);

  const timer = (
    <h2 className="count-down">
      {minutes > 9 ? minutes : "0" + minutes} : {seconds > 9 ? seconds : "0" + seconds}
</h2>
  );

  function changeTenzies(state) {
    setTenzies(state);
  }

  function changeGameState(state) {
    setIsGameOver(state);
  }

  function startNewGame(time) {
    setTenzies("game");
    setIsGameOver(false);
    const newDeadline = new Date();
    newDeadline.setSeconds(newDeadline.getSeconds() + time);
    restart(newDeadline, true);
  }

  return (
    <Context.Provider
      value={{
        timer,
        startNewGame,
        changeGameState,
        changeTenzies,
        tenzies,
        isRunning,
        isGameOver,
        seconds
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };