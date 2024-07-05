// example.tsx

import React from 'react';

const App: React.FC = () => {
  const storeName = 'myStore';

  return (
    <div>
      <h1>{t(`store.${storeName}`)}</h1>
      <p>{t(`otherText.${storeName}`)}</p>
      <p>{t('staticText')}</p>
    </div>
  );
};

export default App;
