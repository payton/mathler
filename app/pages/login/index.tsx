import type { NextPage } from "next";
import Head from "next/head";
import { useDynamicContext } from "@dynamic-labs/sdk-react";
import "98.css";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const router = useRouter();
  const { user, setShowAuthFlow } = useDynamicContext();

  if (user) {
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Mathler</title>
        <meta
          name="description"
          content="Mathler is Wordle for math problems. Attempt each challenge and receive an NFT."
        />
        <link rel="icon" href="/w9e-icon.png" />
      </Head>

      <div
        className="h-screen w-screen flex flex-col"
        style={{ backgroundColor: "#018080" }}
      >
        <div className="w-full h-full" id="desktop">
          <div
            className="login-screen window select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{ width: "400px" }}
          >
            <div className="title-bar bg-blue-900">
              <div className="title-bar-text">
                <div className="flex">
                  <p>Enter Password</p>
                </div>
              </div>
              <div className="title-bar-controls">
                <button aria-label="Close"></button>
              </div>
            </div>
            <div className="window-body">
              <div className="grid grid-cols-6 grid-rows-2 gap-4 justify-items-center">
                <div className="col-span-6 row-span-1 align-center">
                  <img
                    src="/w9e.png"
                    alt="Notepad icon"
                    className="w-auto h-20 mr-1"
                  />
                </div>
                <div className="col-span-6 row-span-1 w-full">
                  <p className="mb-1">
                    Select a <u>w</u>allet:
                  </p>
                  <select id="selectProvider" className="w-full pl-1">
                    <option value="dynamic" selected>
                      Dynamic
                    </option>
                  </select>
                  <p className="mb-1 mt-3">Password:</p>
                  <input
                    className="w-full"
                    type="text"
                    disabled
                    value="No passwords here!"
                  />
                </div>
                <div className="col-span-6 row-span-1 w-full flex place-content-end">
                  <button
                    className="px-4"
                    onClick={() => setShowAuthFlow(true)}
                  >
                    Sign-In with Ethereum
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-8 flex justify-end w-full login-screen">
          <div
            className="justify-end px-2 items-center flex m-1 cursor-default select-none"
            style={{ color: "white", textShadow: "2px 2px black" }}
          >
            Windows 90 ETH EIP.4361
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
