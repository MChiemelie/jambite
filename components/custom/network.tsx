'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useNetworkState } from 'react-use';
import { Spinner } from '@/components/shadcn/spinner';

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

      if (state.online === true) {
        setIsReconnecting(false);
        setReconnectAttempt(0);
      }
    }, 1000);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [state.online]);

  useEffect(() => {
    if (showOffline && reconnectAttempt < 5) {
      reconnectTimer.current = setTimeout(
        () => {
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
        },
        Math.min(3000 * 2 ** reconnectAttempt, 30000)
      );
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
    <div className='bg-opacity-95 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
      <div className='bg-background animate-in fade-in mx-4 flex max-w-md flex-col items-center gap-4 rounded-lg p-8 text-center shadow-xl duration-300'>
        <Image src='/images/special/offline.png' alt='Offline' width={100} height={100} />

        <h2 className='text-foreground/80 text-2xl font-bold'>No Internet Connection</h2>

        <p className='text-foreground/60'>Please check your internet connection and try again.</p>

        <div className='text-foreground/50 bg-foreground/10 inline-flex items-center rounded-full px-4 py-2 text-sm'>
          <div className='mr-2 h-2 w-2 animate-pulse rounded-full bg-red-500'></div>
          {isReconnecting ? 'Checking connection...' : 'Offline'}
        </div>

        <button onClick={handleRetry} disabled={isReconnecting} className='w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400' aria-label='Retry connection' type='button'>
          {isReconnecting ? (
            <span className='flex items-center justify-center'>
              Reconnecting...
              <Spinner />
            </span>
          ) : (
            'Try Again'
          )}
        </button>

        {reconnectAttempt > 0 && <p className='text-foreground/50 text-xs'>Attempt {reconnectAttempt} of 5</p>}

        <div className='w-[40%] border-t border-gray-200' />
        <div>
          <p className='text-foreground/50 text-xs'>Connection type: {state.effectiveType || 'Unknown'}</p>
          {state.downlink && <p className='text-foreground/50 text-xs'>Speed: {state.downlink} Mbps</p>}
        </div>
      </div>
    </div>
  );
}
