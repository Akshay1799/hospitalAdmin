import type { Metadata } from "next";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { ModeProvider } from "@/lib/mode-context";
import { DoctorWorkflowProvider } from "@/lib/doctor-workflow-context";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Qlyno - Doctor Portal",
  description: "Digital practice management for solo doctors and multi-doctor clinics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ModeProvider>
          <DoctorWorkflowProvider>
            <AppShell>{children}</AppShell>
          </DoctorWorkflowProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
