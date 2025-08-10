import React from 'react';

export default function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <style>{`
        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh; /* Take full viewport height */
          width: 100%; /* Take full width */
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #333;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}