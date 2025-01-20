import { useEffect, useState } from "react";
import "./Welcome.css";

function Welcome() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  return (
    <div className="flex flex-col items-center mt-64 h-screen bg-cover bg-center text-center">
      <div
        className={`transform transition-all duration-700 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h1 className="mb-4 text-4xl font-bold md:text-6xl tracking-wide flex items-center justify-center">
          Welcome to the Dashboard
          <span
            className="ml-2 text-5xl md:text-7xl animate-wave"
            role="img"
            aria-label="waving hand"
          >
            👋
          </span>
        </h1>
        <p className="text-xl mb-8 max-w-xl mx-auto drop-shadow-md tracking-wider mt-5 leading-8">
          Manage your data and track your progress efficiently with our powerful
          tools.
        </p>
      </div>
    </div>
  );
}

export default Welcome;
