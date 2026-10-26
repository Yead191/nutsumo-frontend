import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SessionGuard } from "@/components/auth/SessionGuard";
import { antdTheme } from "@/lib/antd-theme";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "271078384120-ddc85psk3ifln1av8k3n57dsqgo8hq8a.apps.googleusercontent.com";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <SessionGuard />
      <AntdRegistry>
        <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
      </AntdRegistry>
      <Toaster
        theme="light"
        position="bottom-right"
        duration={2500}
        closeButton
        gap={10}
        toastOptions={{
          classNames: {
            toast:
              "group !font-sans !rounded-xl !border !border-slate-200 !bg-white !text-slate-900 !shadow-[0_18px_40px_-20px_rgba(254,55,93,0.22)]",
            title: "!text-slate-900 !font-semibold !text-sm",
            description: "!text-slate-500 !text-[13px]",
            actionButton:
              "!bg-[#FE375D] hover:!bg-[#e0284e] !text-white !rounded-full !text-xs !font-semibold transition-colors",
            cancelButton:
              "!bg-slate-100 !text-slate-700 !rounded-full !text-xs",
            closeButton:
              "!bg-slate-50 !border-slate-200 !text-slate-400 hover:!text-[#FE375D]",
            success: "[&_[data-icon]]:!text-emerald-500",
            error: "[&_[data-icon]]:!text-[#FE375D]",
          },
        }}
      />
    </GoogleOAuthProvider>
  );
}
