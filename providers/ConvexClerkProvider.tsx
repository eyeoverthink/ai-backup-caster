"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient('https://impressive-mosquito-854.convex.cloud');

const ConvexClerkProvider = ({ children }: { children: ReactNode }) => (
  <ClerkProvider publishableKey={'pk_test_bW9kZXN0LXNhd2ZseS03OS5jbGVyay5hY2NvdW50cy5kZXYk'} appearance={{
    layout: { 
      socialButtonsVariant: 'iconButton',
      logoImageUrl: '/icons/auth-logo.svg'
    },
    variables: {
      colorBackground: '#15171c',
      colorPrimary: '',
      colorText: 'white',
      colorInputBackground: '#1b1f29',
      colorInputText: 'white',
    }
  }}>
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  </ClerkProvider>
);

export default ConvexClerkProvider;