import React from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import IssueCredential from './components/IssueCredential'
import VerifyCredential from './components/VerifyCredential'

function App() {
  return (
    <Router>
      <div className="min-h-screen gradient-bg">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-4xl mx-auto px-6 py-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              🔐 Kube Credentials
            </h1>
            <p className="text-white/80 text-lg font-light">
              Secure Credential Management System
            </p>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex justify-center space-x-8">
              <NavLink 
                to="/issue" 
                className={({ isActive }) =>
                  `px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                ✨ Issue Credential
              </NavLink>
              <NavLink 
                to="/verify" 
                className={({ isActive }) =>
                  `px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                ✅ Verify Credential
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-6">
            <Routes>
              <Route path="/" element={<IssueCredential />} />
              <Route path="/issue" element={<IssueCredential />} />
              <Route path="/verify" element={<VerifyCredential />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/10 backdrop-blur-lg border-t border-white/20">
          <div className="max-w-4xl mx-auto px-6 py-6 text-center">
            <p className="text-white/70 text-sm">
              © 2025 Kube Credentials - Microservices Architecture Demo
            </p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
