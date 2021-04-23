import { createContext, ReactNode, useState } from "react";

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
  setPlayingState: (state: boolean) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [episodeList, setEpisodeList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  return (
    <PlayerContext.Provider value={{ 
      episodeList,
      currentEpisodeIndex,
      play,
      isPlaying,
      togglePlay,
      setPlayingState 
    }}>
      {children}     
    </PlayerContext.Provider>
  );
}