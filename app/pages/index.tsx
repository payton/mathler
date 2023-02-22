import type { NextPage } from 'next';
import Head from 'next/head';
import Tile from '../components/Tile';
import InputTile from '../components/InputTile';
import { useEffect, useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react';
import axios from 'axios';
import { SessionGetResponse, StartPostResponse, SessionPutRequest, SessionPutResponse } from '../utils/types';
import { replaceChar, getDisplayTime } from '../utils/misc';
import '98.css'
import { useRouter } from 'next/router';
import Board from '../components/Board';
import Controls from '../components/Controls';

const Home: NextPage = () => {
  const router = useRouter();
  const { user, authToken, handleLogOut } = useDynamicContext();
  
  const tileCount = 36;
  const [clock, setClock] = useState<string>("");
  const [sessionId, setSessionId] = useState<number | undefined>();
  const [guessNumber, setGuessNumber] = useState<number>(0);

  const [board, setBoard] = useState<(string)>("?".repeat(tileCount));
  const [colors, setColors] = useState<(string)>("W".repeat(tileCount));
  const [target, setTarget] = useState<number>(0);

  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [messageTitle, setMessageTitle] = useState<string>("Error.");
  const [messageBody, setMessageBody] = useState<string>("Something went wrong.");

  const [loading, setLoading] = useState<boolean>(true);

  // Lifecycle
  useEffect(() => {
    setInterval(
      () => setClock(getDisplayTime()),
      1000
    );
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      axios.post<StartPostResponse>('/api/start', {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }).then((response) => {
        setSessionId(response.data.id);
        axios.get<SessionGetResponse>(`/api/play/${response.data.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }).then((response) => {
          setBoard(response.data.board);
          setColors(response.data.colors);
          setTarget(response.data.target);
          setGuessNumber(response.data.colors.indexOf("W") / 6);
          setLoading(false);
        });
      });
    }
  }, [user]);

  // Event Handlers
  function handleInputTileClick(value: string) {
    let nextGuessLocation = board.indexOf("?");

    if (nextGuessLocation >= guessNumber * 6 && nextGuessLocation < (guessNumber * 6) + 6) {
      setBoard(replaceChar(board, nextGuessLocation, value));
    } else {
      setMessageTitle("Guess not submitted.");
      setMessageBody("You must submit your current guess before you can enter another.");
      setShowMessage(true);
    }
  }

  function handleDelete() {
    let nextGuessLocation = board.indexOf("?");
    if (nextGuessLocation > 0 && (Math.floor(nextGuessLocation / 6) === Math.floor((nextGuessLocation - 1) / 6))) {
      setBoard(replaceChar(board, nextGuessLocation - 1, "?"));
    }
  }

  function handleEnter() {
    if (user && authToken) {
      const request: SessionPutRequest = {
        board: board,
      }
      axios.put<SessionPutResponse>(`/api/play/${sessionId}`, request, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }).then((response) => {
        if (!response.data.success) {
          setMessageTitle("Error submitting guess.");
          setMessageBody(response.data.message);
          setShowMessage(true);
        } else {
          setBoard(response.data.board);
          setColors(response.data.colors);
          setGuessNumber(response.data.colors.indexOf("W") / 6);
        }
      });
    }
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

      <div className="h-screen w-screen flex flex-col" style={{backgroundColor: "#018080"}}>
        <div className="w-full h-full" id="desktop">
          <div className="desktop-screen window inline-block select-none">
            {!loading && 
              <>
                <div className="title-bar">
                    <div className="title-bar-text">
                        <div className="flex">
                            <img src="/w98-calculator.png" alt="Windows 98 calculator icon" className="w-4 h-4 mr-1" />
                            Mathler - Session ID ({sessionId})
                        </div>
                    </div>
                    <div className="title-bar-controls">
                        <button id="toggleSize" aria-label="Maximize"></button>
                        <button id="closeButton" aria-label="Close" title="Sign-Out"></button>
                    </div>
                </div>
                
                <div className='window-body'>
                  <Board board={board} colors={colors}></Board>
                  <Controls enterCallback={handleEnter} deleteCallback={handleDelete} inputCallback={handleInputTileClick}></Controls>
                </div>
                <div className="status-bar">
                  <p className="status-bar-field">Target: {target}</p>
                  <p className="status-bar-field">Player: {user?.walletPublicKey}</p>
                  <p className="status-bar-field">Guess: {guessNumber} / 6</p>
                </div>
              </>
            }
          </div>
        </div>
        <div className="h-8 menu-bar flex desktop-screen">
            <div className="flex items-left w-full">
                <button className="m-1 cursor-pointer" onClick={handleLogOut}>
                    <div className="flex items-center justify-evenly">
                        <img
                                src="/w9e-icon.png"
                                alt="Start Button"
                                className="w-4 w-4 mb-0.5"
                                draggable="false"
                        />
                        &nbsp;Sign Out
                    </div>
                </button>
                <button className="m-1" id="personalNotepad">
                    <div className="flex items-left justify-evenly">
                        Mathler - Session ID ({sessionId})
                    </div>
                </button>
            </div>
            <div
                className="clock justify-end px-4 items-center flex m-1 cursor-default select-none w-28"
            >
              {clock}
            </div>
          </div>
      </div>

      {showMessage &&
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm">
          <div className="window select-none w-fit mx-auto">
              <div className="title-bar bg-blue-900">
                  <div className="title-bar-text">
                      <div className="flex">
                          <p>{messageTitle}</p>
                      </div>
                  </div>
                  <div className="title-bar-controls">
                      <button onClick={() => setShowMessage(false)} aria-label="Close"></button>
                  </div>
              </div>
              <div className="window-body">
                  <div className="grid grid-cols-6">
                      <div>
                          <img src="/warning.png" alt="Notepad icon" className="w-8 h-8 mr-1" />
                      </div>
                      <div className="col-span-5 text-center align-middle"><p>{messageBody}</p></div>
                  </div>
              </div>
          </div>
        </div>
}
    </>
  );
};

export default Home;
