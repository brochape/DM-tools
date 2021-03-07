import React from 'react';
import './App.css';
import { MainPageContent } from './molecule/MainPageContent/MainPageContent';
import { SideMenu } from './molecule/SideMenu/SideMenu';

function App() {
  return (
    <div className="App">
      <SideMenu />
      <MainPageContent />
    </div>
  );
}

export default App;
