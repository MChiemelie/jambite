'use client';

// react-scan must be imported before react
import { scan } from 'react-scan';
import { JSX, useEffect } from 'react';

export default function ReactScan(): JSX.Element {
  useEffect(() => {
    scan({
      enabled: true,
    });
  }, []);

  return <></>;
}
