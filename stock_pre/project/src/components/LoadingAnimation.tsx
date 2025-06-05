import React from 'react';
import Lottie from 'lottie-react';

const LoadingAnimation: React.FC = () => {
  // Animation data from LottieFiles - Stock Market Animation
  const animationData = {
    "v": "5.5.7",
    "fr": 29.9700012207031,
    "ip": 0,
    "op": 60.0000024438501,
    "w": 200,
    "h": 200,
    "nm": "Loading",
    "ddd": 0,
    "assets": [],
    "layers": [{
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Line",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "p": { "a": 0, "k": [100, 100] },
        "a": { "a": 0, "k": [0, 0, 0] },
        "s": { "a": 0, "k": [100, 100, 100] }
      },
      "shapes": [{
        "ty": "gr",
        "it": [{
          "ty": "rc",
          "d": 1,
          "s": { "a": 0, "k": [80, 4] },
          "p": { "a": 1, "k": [
            { "t": 0, "s": [-20, 0], "h": 1 },
            { "t": 30, "s": [20, 0], "h": 1 },
            { "t": 60, "s": [-20, 0] }
          ]},
          "r": { "a": 0, "k": 0 }
        }],
        "nm": "Line",
        "np": 1,
        "cix": 2,
        "bm": 0,
        "dr": 0,
        "ef": [],
        "ty": "gr"
      }],
      "ip": 0,
      "op": 60.0000024438501,
      "st": 0,
      "bm": 0
    }]
  };

  return (
    <div className="flex justify-center items-center h-64">
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

export default LoadingAnimation;