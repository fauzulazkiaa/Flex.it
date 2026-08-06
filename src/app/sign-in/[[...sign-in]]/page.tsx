import { SignIn } from '@clerk/nextjs';
import { Trophy } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-300 flex flex-col items-center justify-center p-6 relative">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f11_1px,transparent_1px),linear-gradient(to_bottom,#0f0f11_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      
      <div className="relative z-10 w-full max-w-[400px] flex flex-col items-center">
        
        <div className="flex items-center gap-2.5 mb-8">
          <Image src="/logo-app.png" alt="Flex.it Logo" width={32} height={32} className="w-8 h-8 rounded-lg" />
          <span className="font-extrabold text-zinc-100 text-lg tracking-tight">
            Flex.it
          </span>
        </div>

        {/* Custom Styled Clerk SignIn Component */}
        <SignIn 
          appearance={{
            elements: {
              card: "bg-zinc-950/60 backdrop-blur-md border border-zinc-800 shadow-2xl rounded-2xl p-0 w-full",
              headerTitle: "text-zinc-100 font-extrabold text-xl",
              headerSubtitle: "text-zinc-400 text-xs sm:text-sm",
              socialButtonsBlockButton: "bg-zinc-900/50 border border-zinc-800 text-zinc-200 hover:bg-zinc-800/80 transition-colors cursor-pointer",
              socialButtonsBlockButtonText: "text-zinc-200 font-semibold",
              formButtonPrimary: "bg-emerald-400 text-zinc-950 hover:bg-emerald-300 font-extrabold text-sm shadow-md shadow-emerald-500/10 transition-colors cursor-pointer",
              formFieldLabel: "text-zinc-400 text-xs font-semibold",
              formFieldInput: "bg-zinc-900/40 border border-zinc-800 text-zinc-200 rounded-xl focus:border-emerald-500 transition-colors",
              footerActionText: "text-zinc-400 text-xs",
              footerActionLink: "text-emerald-400 hover:text-emerald-300 font-semibold text-xs transition-colors",
              identityPreviewText: "text-zinc-200",
              identityPreviewEditButtonIcon: "text-emerald-400",
              formResendCodeLink: "text-emerald-400 hover:text-emerald-300",
              otpCodeFieldInput: "bg-zinc-900 border border-zinc-800 text-zinc-200 focus:border-emerald-500",
              dividerLine: "bg-zinc-800",
              dividerText: "text-zinc-500 text-xs font-bold"
            }
          }}
        />

      </div>
    </div>
  );
}
