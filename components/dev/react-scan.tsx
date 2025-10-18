'use client';

import { type JSX, useEffect } from 'react';

export function ReactScan(): JSX.Element | null {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('react-scan')
        .then((module) => {
          const { scan } = module;
          scan({
            enabled: true,
            log: false
          });
        })
        .catch((error) => {
          console.error('Failed to load react-scan:', error);
        });
    }
  }, []);

  return null;
}
