"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const GoogleOAuthProviderWrapper = dynamic(
  () =>
    import("@react-oauth/google").then((mod) => {
      const Provider = ({
        children,
        clientId,
      }: {
        children: ReactNode;
        clientId: string;
      }) => (
        <mod.GoogleOAuthProvider clientId={clientId}>
          {children}
        </mod.GoogleOAuthProvider>
      );
      return Provider;
    }),
  { ssr: false }
);

export default GoogleOAuthProviderWrapper;
