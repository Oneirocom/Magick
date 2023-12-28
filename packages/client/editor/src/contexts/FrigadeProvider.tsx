import { FrigadeProvider as FrigadeProviderOG, useUser } from "@frigade/react";
import { useNavigate } from "react-router-dom";
import {FRIGADE_KEY } from 'shared/config'
import { useSelector } from "react-redux"


type Props = {
  children: React.ReactNode;
};

const FrigadeProvider = ({ children }: Props) => {
    const globalConfig = useSelector((state: any) => state.globalConfig)
    const navigate = useNavigate();




  return (
    <FrigadeProviderOG
      publicApiKey={FRIGADE_KEY|| ""}
      userId={globalConfig?.userId || "anonymous"}
      config={{
        navigate: (url, target): void => {
          if (target === "_blank") {
            window.open(url, "_blank");
          } else {
            navigate(url);
          }
        },
        defaultAppearance: {
          theme: {
            colorText: "white !important",
            colorTextSecondary: "white",
            colorTextOnPrimaryBackground: "#fff",
            colorPrimary: "#1BC5EB",
            colorBackground: "#262730",
          },
          styleOverrides: {
            button: {
              border: "none",
              outline: "none",
            },
          },
        },
      }}
    >
      {children}
    </FrigadeProviderOG>
  );
};

export default FrigadeProvider;
