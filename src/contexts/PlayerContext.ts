import { createContext } from "react";

type Episode = {
  url: string;
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;

  play: (episode: Episode) => void;
  togglePlay: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);
