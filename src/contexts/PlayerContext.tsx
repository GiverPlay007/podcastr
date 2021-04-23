import { createContext, ReactNode, useContext, useState } from "react";

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
  isLooping: boolean;
  isShuffling: boolean;
  
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  hasNextEpisode: () => boolean;
  hasPreviousEpisode: () => boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [episodeList, setEpisodeList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function hasNextEpisode(): boolean {
    return currentEpisodeIndex +1 < episodeList.length;
  }

  function playNext() {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } 
    else if(hasNextEpisode()) {
      setCurrentEpisodeIndex(currentEpisodeIndex +1);
    }
  }

  function hasPreviousEpisode(): boolean {
    return currentEpisodeIndex > 0;
  }

  function playPrevious() {
    if(hasPreviousEpisode()) {
      setCurrentEpisodeIndex(currentEpisodeIndex -1);
    }
  }

  return (
    <PlayerContext.Provider value={{ 
      episodeList,
      currentEpisodeIndex,
      play,
      playList,
      isPlaying,
      playNext,
      playPrevious,
      togglePlay,
      setPlayingState,
      hasNextEpisode,
      hasPreviousEpisode,
      isLooping,
      isShuffling,
      toggleLoop,
      toggleShuffle
    }}>
      {children}     
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}