import { useState, useEffect } from 'react';

export default function MinimalModernTimeout() {
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleAutoRedirect();
    }
  }, [countdown]);

  const handleAutoRedirect = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      window.location.href = '/login';
    }, 800);
  };

  const handleManualRedirect = () => {
    if (buttonActive) return;
    setButtonActive(true);
    setIsRedirecting(true);
    
    setTimeout(() => {
      window.location.href = '/login';
    }, 600);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all">
          {/* Top colored band */}
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <div className="p-8">
            {/* Floating badge */}
            <div className="flex justify-center -mt-14 mb-6">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <div className="bg-red-50 rounded-full p-3">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Session Expired</h2>
              <p className="text-gray-500 mb-6">
                Your session has timed out for security reasons. We're redirecting you to the login page.
              </p>
              
              {/* Progress circle */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Circular progress background */}
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle 
                      className="text-gray-200" 
                      strokeWidth="8" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                    />
                    {/* Progress circle - animating stroke-dashoffset based on countdown */}
                    <circle 
                      className="text-blue-600 transition-all duration-1000 ease-linear" 
                      strokeWidth="8" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 * (1 - countdown / 10)} 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="40" 
                      cx="50" 
                      cy="50" 
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  
                  {/* Countdown number in center */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="text-3xl font-bold text-gray-800">
                      {isRedirecting ? (
                        <svg className="w-8 h-8 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        countdown
                      )}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 font-medium">
                {isRedirecting 
                  ? 'Redirecting you to login...' 
                  : `Redirecting in ${countdown} second${countdown !== 1 ? 's' : ''}`}
              </p>
            </div>
            
            {/* Login button */}
            <button
              onClick={handleManualRedirect}
              disabled={buttonActive}
              className={`w-full py-4 rounded-xl font-medium transition duration-300 transform ${
                buttonActive
                  ? 'bg-blue-200 text-blue-700 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-98 hover:shadow-lg text-white'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Login Again
              </div>
            </button>
          </div>
        </div>
        
        {/* Footer text */}
        <p className="text-center mt-6 text-white/70 text-sm">
          This is for your security. Inactive sessions are automatically closed.
        </p>
      </div>
    </div>
  );
}