import { useRef, useState, useEffect } from "react";

function Player({
    song,
    nextSong,
    previousSong
}) {

    const audioRef = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);


    useEffect(() => {

        const audio = audioRef.current;

        if (!audio || !song) return;


        audio.pause();

        setPlaying(false);
        setCurrentTime(0);
        setDuration(0);


        audio.src = `/songs/${song.file}`;

        audio.load();


        const playSelectedSong = async () => {

            try {

                await audio.play();

                setPlaying(true);

            } catch (error) {

                console.log(
                    "Auto Play Error:",
                    error
                );

            }

        };


        playSelectedSong();


    }, [song]);


    function playMusic() {

        const audio = audioRef.current;

        audio.play()
            .then(() => {

                setPlaying(true);

            })
            .catch((error) => {

                console.log(
                    "Play Error:",
                    error
                );

            });

    }


    function pauseMusic() {

        const audio = audioRef.current;

        audio.pause();

        setPlaying(false);

    }


    function loadedMetadata() {

        const audio = audioRef.current;

        setDuration(audio.duration);

    }


    function timeUpdate() {

        const audio = audioRef.current;

        setCurrentTime(audio.currentTime);

    }


    function changeTime(e) {

        const value = Number(e.target.value);

        audioRef.current.currentTime = value;

        setCurrentTime(value);

    }


    function formatTime(time) {

        if (!Number.isFinite(time)) {
            return "0:00";
        }

        const minutes = Math.floor(time / 60);

        const seconds = Math.floor(time % 60);

        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    }


    if (!song) {

        return (

            <div className="player">

                <h3>
                    🎵 No Song Playing
                </h3>

            </div>

        );

    }


    return (

        <div className="player">

            <div className="player-song">

                <img
                    src={
                        song.image ||
                        "https://picsum.photos/100"
                    }
                    alt={song.title}
                />


                <div className="player-info">

                    <h3>
                        {song.title}
                    </h3>

                    <p>
                        {song.artist}
                    </p>

                </div>

            </div>


            <audio

                ref={audioRef}

                onLoadedMetadata={loadedMetadata}

                onTimeUpdate={timeUpdate}

                onEnded={nextSong}

            />


            <div className="player-center">

                <div className="controls">

                    <button
                        onClick={previousSong}
                        className="control-button"
                    >
                        ⏮
                    </button>


                    <button
                        onClick={
                            playing
                                ? pauseMusic
                                : playMusic
                        }
                        className="main-play"
                    >
                        {playing ? "⏸" : "▶"}
                    </button>


                    <button
                        onClick={nextSong}
                        className="control-button"
                    >
                        ⏭
                    </button>

                </div>


                <div className="progress">

                    <span>
                        {formatTime(currentTime)}
                    </span>


                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={changeTime}
                    />


                    <span>
                        {formatTime(duration)}
                    </span>

                </div>

            </div>

        </div>

    );
}

export default Player;