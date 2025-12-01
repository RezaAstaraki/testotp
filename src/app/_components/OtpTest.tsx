'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {}

export default function OtpTest({}: Props) {
  const [otp, setOtp] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if WebOTP API is supported
  useEffect(() => {
    if ('OTPCredential' in window) {
      setIsSupported(true)
      
      // Auto-fill OTP from SMS
      const abortController = new AbortController()
      
      const handleOTP = async () => {
        try {
          if (navigator.credentials) {
            const content = await navigator.credentials.get({
              otp: { transport: ['sms'] },
              signal: abortController.signal,
            } as any) as { code?: string } | null
            
            if (content && 'code' in content && content.code) {
              setOtp(content.code)
            }
          }
        } catch (error: any) {
          // User cancelled or other error
          if (error.name !== 'AbortError') {
            console.error('Error getting OTP:', error)
          }
        }
      }

      // Listen for OTP messages
      handleOTP()

      return () => {
        abortController.abort()
      }
    }
  }, [])

  const exampleSMS = `Your verification code is 123456 @testotp-uszr.vercel.app #123456`

  const handleCopy = () => {
    navigator.clipboard.writeText(exampleSMS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            OTP Auto-Fill Test
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter the verification code sent to your phone
          </p>
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="otp" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Verification Code
          </label>
          <input
            ref={inputRef}
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            value={otp}
            onChange={handleChange}
            placeholder="Enter 6-digit code"
            className="w-full px-4 py-3 text-center text-2xl font-semibold tracking-widest border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            maxLength={6}
          />
          
          {isSupported && (
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Auto-fill supported - Code will be filled automatically
            </p>
          )}
          
          {!isSupported && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              ⚠️ Auto-fill not supported in this browser
            </p>
          )}
        </div>

        {otp.length === 6 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">
              ✓ Code received: {otp}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Example SMS (Copy to test)
          </h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <code className="text-sm text-gray-800 dark:text-gray-200 break-all block mb-3">
              {exampleSMS}
            </code>
            <button
              onClick={handleCopy}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy SMS Example
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
            <strong>Note:</strong> Send this SMS to your phone to test auto-fill. 
            Make sure your phone is connected and the browser has SMS permissions.
            The code will be automatically extracted and filled in the input field above.
          </p>
        </div>
      </div>
    </div>
  )
}