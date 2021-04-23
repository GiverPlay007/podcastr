import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";

import Slider from "rc-slider";
import Image from "next/image";
import styles from "./styles.module.scss";

import "rc-slider/assets/index.css";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0);
  
  const { 
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNextEpisode,
    hasPreviousEpisode,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    clearPlayerState
  } = usePlayer();

  function setupProgressListener() {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener("timeupdate", event => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  function handleEpisodeEnded() {
    if(hasNextEpisode()) {
      playNext();
    }
    else {
      clearPlayerState();
    }
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  useEffect(() => {
    if(!audioRef.current) return;

    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            objectFit="cover"
            src={episode.thumbnail}
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{ convertDurationToTimeString(progress) }</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                onChange={handleSeek}
                value={progress}
                trackStyle={{ backgroundColor: "#04D361" }}
                railStyle={{ backgroundColor: "#9F75FF" }}
                handleStyle={{ borderColor: "#04D361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{ convertDurationToTimeString(episode?.duration ?? 0) }</span>
        </div>

        {episode && 
            <audio 
              src={episode.url}
              ref={audioRef}
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
              onEnded={handleEpisodeEnded}
              onLoadedMetadata={setupProgressListener}
              loop={isLooping}
              autoPlay
          />}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length == 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode || !hasPreviousEpisode()} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying
            ? <img src="/pause.svg" alt="Pausar" />
            : <img src="/play.svg" alt="Tocar" />
            }
          </button>
          <button type="button" disabled={!episode || !hasNextEpisode()} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
