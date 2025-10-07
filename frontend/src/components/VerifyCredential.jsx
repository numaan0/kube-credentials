// src/components/VerifyCredential.jsx
import React, { useState } from 'react'
import axios from 'axios'

const VerifyCredential = () => {
  const [credential, setCredential] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!credential.trim()) {
      setError('Please enter the credential to verify')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post('http://localhost:3002/verify', {
        credential: credential.trim()
      })
      
      setResult(response.data)
      setCredential('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify credential')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fadeIn">
      <div className="bg-white rounded-2xl card-shadow p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Verify Credential
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Enter the exact credential used during issuance to verify its authenticity.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Credential to Verify
            </label>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder="Enter the exact credential used during issuance"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed pr-12"
                disabled={loading}
              />
              
              {/* Show/Hide Password Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="mt-2 text-sm text-gray-500">
              💡 This must match exactly with the credential you used when issuing
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !credential.trim()}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify Credential</span>
            )}
          </button>
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

        {/* Verification Result */}
        {result && (
          <div className={`mt-6 px-6 py-4 rounded-xl ${
            result.isValid 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
          }`}>
            <h3 className="font-bold text-lg mb-3 flex items-center space-x-2">
              <span>{result.isValid ? '✅' : '❌'}</span>
              <span>{result.isValid ? 'Valid Credential' : 'Invalid Credential'}</span>
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Status: </span>
                <span>{result.message}</span>
              </div>
              
              {result.isValid && (
                <>
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="font-semibold text-sm">Issued By:</span>
                        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded mt-1">
                          {result.issuedBy}
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-sm">Issued At:</span>
                        <div className="text-sm mt-1">
                          {new Date(result.issuedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-green-600 bg-white p-3 rounded-lg border border-green-200">
                    🔐 Credential authenticity verified through cryptographic validation
                  </div>
                </>
              )}

              {!result.isValid && (
                <div className="text-sm text-yellow-600 bg-white p-3 rounded-lg border border-yellow-200">
                  ⚠️ This credential was not found in our secure database or has been tampered with
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyCredential
