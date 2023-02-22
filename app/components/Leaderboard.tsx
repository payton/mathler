import { LeaderboardGetResponse } from "../utils/types";

type LeaderboardProps = {
  data: LeaderboardGetResponse;
};

const Leaderboard = (props: LeaderboardProps) => {

    const renderedLeaders = props.data.leaderboard.map((leader, idx) => {
        return (
            <li key={`${leader.owner}-${idx}`}>
                Place: {idx + 1}
                <ul>
                    <li>Player: {leader.owner}</li>
                    <li>Wins: {leader.count}</li>
                </ul>
            </li>
        );
    });

  return (
    <>
        <div className="title-bar">
            <div className="title-bar-text">
            <div className="flex">
                <img
                src="/w98-doc.webp"
                alt="Windows 98 doc icon"
                className="w-4 h-4 mr-1"
                />
                Leaderboard
            </div>
            </div>
            <div className="title-bar-controls">
                <button aria-label="Maximize"></button>
                <button aria-label="Close"></button>
            </div>
        </div>
        <div className="window-body">
            <ul className="tree-view">
                <li>
                    Leaderboard
                    <ul>
                        {renderedLeaders}
                    </ul>
                </li>
            </ul>
        </div>
    </>
  );
};

export default Leaderboard;
