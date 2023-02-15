import { Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../Context";

export default function Home() {
  const { startNewGame} = useContext(Context);

  return (
    <div className="home">
      <h1 className="home-title"> TENZIES </h1>
      <p className="home-instructions">
        TENZI is the world’s fastest dice game! Fast, fun, and engaging.
        <br />
        You'll get 12 dice. The object of the game is to roll the dice as fast
        as possible an get all dice on the same number.
        <br />
        You can make it more interesting by choosing the difficulty level.
      </p>

      <div className="difficulty">
        <button
          onClick={() => {
            startNewGame(45);
          }}
        >
          <Link to="/game"> Easy </Link>
        </button>

        <button
          onClick={() => {
            startNewGame(30);
          }}
        >
          <Link to="/game"> Medium </Link>
        </button>

        <button
          onClick={() => {
            startNewGame(15);
          }}
        >
          <Link to="/game"> Hard </Link>
        </button>
      </div>
    </div>
  );
}
