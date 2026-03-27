import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import PlayZone from './components/PlayZone';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/playground" element={<PlayZone />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
