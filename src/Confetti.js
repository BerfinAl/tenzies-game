import { useState, useEffect } from "react";
import Confetti from "react-confetti";

export default () => {
 const size = useWindowSize();
// Hook
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []); 
  return windowSize;
}
  return <Confetti width={size.width} height={size.height} />;
};
