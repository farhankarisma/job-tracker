
'use client'; // This is crucial!

import { Provider } from 'react-redux';
import { store } from '../lib/store'// We will create this next

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}