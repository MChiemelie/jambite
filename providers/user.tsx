'use client';

import { useCallback, useEffect, useRef } from 'react';
import { SWRConfig } from 'swr';
import { useUser } from '@/contexts';
import { disableAI, getUserData } from '@/services';

function AIWatcher() {
  const { user, mutate } = useUser();
  const disabledRef = useRef(false);
  const isProcessingRef = useRef(false);

  const handleDisableAI = useCallback(async () => {
    if (!user || disabledRef.current || isProcessingRef.current) return;
    if (user.trials === 0 && user.ai) {
      isProcessingRef.current = true;
      disabledRef.current = true;

      try {
        await disableAI();
        await mutate();
      } catch (error) {
        console.error('❌ Failed to disable AI:', error);
        disabledRef.current = false;
      } finally {
        isProcessingRef.current = false;
      }
    }
  }, [user, mutate]);

  useEffect(() => {
    handleDisableAI();
  }, [handleDisableAI]);

  return null;
}

export default function UserProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig value={{ fetcher: getUserData }}>
      <AIWatcher />
      {children}
    </SWRConfig>
  );
}
