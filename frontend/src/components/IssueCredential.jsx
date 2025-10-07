// src/components/IssueCredential.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const IssueCredential = () => {
  const [credential, setCredential] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showGuide, setShowGuide] = useState(false)
  const [credentialStrength, setCredentialStrength] = useState({
    score: 0,
    feedback: [],
    isValid: false
  })

  // Password strength checker
  const checkCredentialStrength = (password) => {
    const feedback = []
    let score = 0

    // Length check
    if (password.length >= 12) {
      score += 25
    } else if (password.length >= 8) {
      score += 15
      feedback.push('Consider using at least 12 characters')
    } else {
      feedback.push('Must be at least 8 characters long')
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 15
    } else {
      feedback.push('Add uppercase letters (A-Z)')
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 15
    } else {
      feedback.push('Add lowercase letters (a-z)')
    }

    // Numbers check
    if (/\d/.test(password)) {
      score += 15
    } else {
      feedback.push('Add numbers (0-9)')
    }

    // Special characters check
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      score += 20
    } else {
      feedback.push('Add special characters (!@#$%^&*)')
    }

    // No common patterns
    const commonPatterns = ['123', 'abc', 'password', 'admin', 'user', 'qwerty']
    const hasCommonPattern = commonPatterns.some(pattern => 
      password.toLowerCase().includes(pattern)
    )
    
    if (hasCommonPattern) {
      score -= 20
      feedback.push('Avoid common patterns (123, abc, password, etc.)')
    } else {
      score += 10
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      feedback,
      isValid: score >= 70 && password.length >= 8
    }
  }

  useEffect(() => {
    if (credential) {
      setCredentialStrength(checkCredentialStrength(credential))
    } else {
      setCredentialStrength({ score: 0, feedback: [], isValid: false })
    }
  }, [credential])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!credential.trim()) {
      setError('Please enter a credential')
      return
    }

    if (!credentialStrength.isValid) {
      setError('Please choose a stronger credential')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post('http://localhost:3001/issue', {
        credential: credential.trim()
      })
      
      setResult(response.data)
      setCredential('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue credential')
    } finally {
      setLoading(false)
    }
  }

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text)
//   }

  const getStrengthColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getStrengthText = (score) => {
    if (score >= 80) return 'Very Strong'
    if (score >= 60) return 'Strong'
    if (score >= 40) return 'Moderate'
    if (score >= 20) return 'Weak'
    return 'Very Weak'
  }

  return (
    <div className="animate-fadeIn">
      <div className="bg-white rounded-2xl card-shadow p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Issue New Credential
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Create a secure credential with strong authentication requirements.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Secure Credential
              </label>
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 transition-colors"
              >
                <span>💡</span>
                <span>Security Guide</span>
              </button>
            </div>

            {/* Security Guide */}
            {showGuide && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Strong Credential Guidelines:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• At least 12 characters (minimum 8)</li>
                  <li>• Mix of uppercase and lowercase letters</li>
                  <li>• Include numbers (0-9)</li>
                  <li>• Add special characters (!@#$%^&*)</li>
                  <li>• Avoid common words or patterns</li>
                  <li>• Don't use personal information</li>
                </ul>
                <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Example:</strong> MyS3cur3P@ssw0rd2025!
                  </p>
                </div>
              </div>
            )}

            <div className="relative">
              <input
                type="password"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder="Enter your secure credential (e.g., MyS3cur3Cr3d3nt1@l!)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed pr-12"
                disabled={loading}
              />
              
              {/* Show/Hide Password Toggle */}
              <button
                type="button"
                onClick={() => {
                  const input = document.querySelector('input[type="password"], input[type="text"]')
                  if (input.type === 'password') {
                    input.type = 'text'
                  } else {
                    input.type = 'password'
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                👁️
              </button>
            </div>

            {/* Strength Indicator */}
            {credential && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Credential Strength:
                  </span>
                  <span className={`text-sm font-semibold ${
                    credentialStrength.score >= 70 ? 'text-green-600' : 
                    credentialStrength.score >= 40 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getStrengthText(credentialStrength.score)}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(credentialStrength.score)}`}
                    style={{ width: `${credentialStrength.score}%` }}
                  ></div>
                </div>

                {/* Feedback */}
                {credentialStrength.feedback.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      Suggestions:
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {credentialStrength.feedback.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-yellow-500 mt-0.5">⚠️</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Success Message */}
                {credentialStrength.isValid && (
                  <div className="flex items-center space-x-2 text-green-600 text-sm">
                    <span>✅</span>
                    <span>Great! Your credential meets security requirements.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || !credentialStrength.isValid}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Issuing Secure Credential...</span>
              </>
            ) : (
              <span>Issue Secure Credential</span>
            )}
          </button>

          {/* Validation Status */}
          {credential && !credentialStrength.isValid && (
            <div className="text-center text-sm text-gray-600">
              Please strengthen your credential to continue
            </div>
          )}
        </form>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-red-500">❌</span>
              <span className="font-semibold">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl">
            <h3 className="font-bold text-lg mb-3 flex items-center space-x-2">
              <span>✅</span>
              <span>Secure Credential Issued Successfully!</span>
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Message: </span>
                <span>{result.message}</span>
              </div>
              
              

              <div className="text-sm text-green-600 bg-white p-3 rounded-lg border border-green-200">
                🔒 Your credential has been secured with enterprise-grade HMAC-SHA256 encryption.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IssueCredential
