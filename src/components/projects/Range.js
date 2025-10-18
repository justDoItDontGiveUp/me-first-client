import React from "react";
import "../../css/Range.css";

export function Range({ completedSteps }) {
  const totalSteps = 9;

  return (
    <div className="frame-5">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className="step-block"
          style={{
            backgroundColor: index < completedSteps ? "#7abfff" : "#d1e7fb",
            left: `${(index * 100) / totalSteps}%`,
            width: `${100 / totalSteps}%`,
          }}
        ></div>
      ))}
    </div>
  );
}
