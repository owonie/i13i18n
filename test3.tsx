// example.tsx

import React from 'react';
const App: React.FC = () => {
  const storeName = 'myStore';
  return (
    <div>
      <h1>{`store.${storeName}`}</h1>
      <p>{`otherText.${storeName}`}</p>
      <p>{'staticText'}</p>
    </div>
  );
};
export default App;
