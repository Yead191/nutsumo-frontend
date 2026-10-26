import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#2563eb",
    colorInfo: "#0ea5e9",
    colorSuccess: "#16a34a",
    colorError: "#dc2626",
    colorWarning: "#f59e0b",
    colorText: "#5B5B5B",
    colorTextHeading: "#00151D",
    colorBgLayout: "#ECF1F5",
    colorBorder: "#d7e2ea",
    fontFamily: "var(--font-inter), Inter, sans-serif",
    borderRadius: 10,
    controlHeight: 50,
    controlHeightLG: 56,
  },
  components: {
    Button: {
      fontWeight: 700,
      borderRadius: 10,
      controlHeight: 50,
      paddingInline: 22,
    },
    Input: {
      borderRadius: 10,
    },
    Card: {
      borderRadiusLG: 14,
    },
  },
};
