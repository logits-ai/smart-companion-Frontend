"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [coins, setCoins] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [history, setHistory] = useState([]); 
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from Storage
  useEffect(() => {
    const savedCoins = parseInt(localStorage.getItem("neuroCoins")) || 0;
    const savedEnergy = parseInt(localStorage.getItem("neuroEnergy")) || 100;
    const savedHistory = JSON.parse(localStorage.getItem("neuroHistory")) || [];
    
    setCoins(savedCoins);
    setEnergy(savedEnergy);
    setHistory(savedHistory);
    setIsLoaded(true);
  }, []);

  // Save to Storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("neuroCoins", coins);
      localStorage.setItem("neuroEnergy", energy);
      localStorage.setItem("neuroHistory", JSON.stringify(history));
    }
  }, [coins, energy, history, isLoaded]);

  // --- IMPROVED HISTORY SAVER ---
  // Now accepts Difficulty and specific Coin amounts
  const addToHistory = (mainTaskName, difficulty, coinsEarned) => {
    const newTask = {
      id: Date.now(),
      text: mainTaskName, // e.g., "Clean my room"
      date: new Date().toLocaleDateString(),
      coinsEarned: coinsEarned,
      difficulty: difficulty
    };
    setHistory(prev => [newTask, ...prev]); 
  };

  return (
    <UserContext.Provider value={{ 
      coins, setCoins, 
      energy, setEnergy, 
      history, addToHistory, 
      isLoaded 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}