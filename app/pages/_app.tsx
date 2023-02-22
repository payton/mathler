import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { DynamicContextProvider} from '@dynamic-labs/sdk-react';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_APP_ID || 'missing_environment_id'
    }}>
      <Component {...pageProps} />
    </DynamicContextProvider>
  );
}

export default MyApp;
