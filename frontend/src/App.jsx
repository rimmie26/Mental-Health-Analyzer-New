import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-bold mb-6">
          <span className="text-buttery-500">Mind</span>
          <span className="text-pastel-blue-400">Glow</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Your gentle companion for mental wellness.
          <br />
          <span className="text-buttery-400">Check in, breathe, and grow.</span>
        </p>
        <button className="btn-primary">
          Start Your Journey ✨
        </button>
      </div>
    </div>
  )
}

export default App
