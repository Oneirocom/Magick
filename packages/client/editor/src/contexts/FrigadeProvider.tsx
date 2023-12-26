import { FrigadeProvider as FrigadeProviderOG, useUser } from "@frigade/react";
import { useNavigate } from "react-router-dom";
import {FRIGADE_KEY } from 'shared/config'
import { useSelector } from "react-redux"
// import { app } from 'server/core'

type Props = {
  children: React.ReactNode;
};

const FrigadeProvider = ({ children }: Props) => {
    const globalConfig = useSelector((state: any) => state.globalConfig)
    const token = globalConfig?.token
    const navigate = useNavigate();

    //TODO: This is a hack to get the user id from the token. We should be able to get this from token payload
  // const verifyToken = async () => {
  //   try {
  //     const payload = await app
  //       .service('authentication')
  //       .verifyAccessToken(token, {}) // Provide the required arguments here
  //     console.log('Token verified:', payload)
  //   } catch (error) {
  //     console.error('Token verification failed:', error)
  //   }
  // }

  console.log("Ftoken", token)


  return (
    <FrigadeProviderOG
      publicApiKey={FRIGADE_KEY|| ""}
      userId={"user.userId" || "anonymous"}
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
