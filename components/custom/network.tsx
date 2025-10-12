'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useNetworkState } from 'react-use';

export default function NetworkStatus() {
  const state = useNetworkState();
  const [showOffline, setShowOffline] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const debounceTimer = useRef<NodeJS.Timeout>(null);
  const reconnectTimer = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setShowOffline(state.online === false);

      // Reset reconnecting state when back online
      if (state.online === true) {
        setIsReconnecting(false);
        setReconnectAttempt(0);
      }
    }, 1000); // 1 second debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [state.online]);

  // Auto-retry connection check
  useEffect(() => {
    if (showOffline && reconnectAttempt < 5) {
      reconnectTimer.current = setTimeout(
        () => {
          setIsReconnecting(true);

          // Test actual connectivity, not just navigator.onLine
          fetch('https://www.google.com/favicon.ico', {
            mode: 'no-cors',
            cache: 'no-cache'
          })
            .then(() => {
              setShowOffline(false);
              setIsReconnecting(false);
              setReconnectAttempt(0);
            })
            .catch(() => {
              setIsReconnecting(false);
              setReconnectAttempt((prev) => prev + 1);
            });
        },
        Math.min(3000 * 2 ** reconnectAttempt, 30000)
      ); // Exponential backoff
    }

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [showOffline, reconnectAttempt]);

  const handleRetry = () => {
    setIsReconnecting(true);

    fetch('https://www.google.com/favicon.ico', {
      mode: 'no-cors',
      cache: 'no-cache'
    })
      .then(() => {
        setShowOffline(false);
        setIsReconnecting(false);
        setReconnectAttempt(0);
      })
      .catch(() => {
        setIsReconnecting(false);
        setReconnectAttempt((prev) => prev + 1);
      });
  };

  if (!showOffline) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-opacity-95 backdrop-blur-sm'>
      <div className='flex flex-col items-center gap-4 text-center p-8 bg-white rounded-lg shadow-xl max-w-md mx-4 animate-in fade-in duration-300'>
        <Image
          src='/images/special/offline.png'
          alt='Offline'
          width={100}
          height={100}
        />

        <h2 className='text-2xl font-bold text-gray-800'>
          No Internet Connection
        </h2>

        <p className='text-gray-600'>
          Please check your internet connection and try again.
        </p>

        <div className='inline-flex items-center text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full'>
          <div className='w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse'></div>
          {isReconnecting ? 'Checking connection...' : 'Offline'}
        </div>

        <button
          onClick={handleRetry}
          disabled={isReconnecting}
          className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed'
          aria-label='Retry connection'
          type='button'
        >
          {isReconnecting ? (
            <span className='flex items-center justify-center'>
              Reconnecting...
              <Image
                src='/assets/loader.svg'
                alt='Loading circle'
                width={24}
                height={24}
                className='ml-2'
              />
            </span>
          ) : (
            'Try Again'
          )}
        </button>

        {reconnectAttempt > 0 && (
          <p className='text-xs text-gray-500'>
            Attempt {reconnectAttempt} of 5
          </p>
        )}

        <div className='border-t border-gray-200 w-[40%]' />
        <div>
          <p className='text-xs text-gray-500'>
            Connection type: {state.effectiveType || 'Unknown'}
          </p>
          {state.downlink && (
            <p className='text-xs text-gray-500'>
              Speed: {state.downlink} Mbps
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
