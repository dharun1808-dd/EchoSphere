import { useState } from "react";
import Player from "./components/Player";
import Navbar from "./components/Navbar";
import SongCard from "./components/SongCard";
import "./App.css";


function App() {

    const songs = [

        {
            title: "Dream Song",
            artist: "Echo Artist",
            image: "https://picsum.photos/200",
            file: "dream.mp3"
        },

        {
            title: "Night Vibes",
            artist: "Moon Artist",
            image: "https://picsum.photos/201",
            file: "night.mp3"
        },

        {
            title: "Ocean Melody",
            artist: "Wave Artist",
            image: "https://picsum.photos/202",
            file: "ocean.mp3"
        },

        {
            title: "Chill Beats",
            artist: "Echo Studio",
            image: "https://picsum.photos/203",
            file: "chill.mp3"
        },

        {
            title: "Morning Vibe",
            artist: "Sky Artist",
            image: "https://picsum.photos/204",
            file: "vibe.mp3"
        }

    ];


    const [currentIndex, setCurrentIndex] = useState(0);


    const currentSong = songs[currentIndex];


    function nextSong() {

        setCurrentIndex((currentIndex + 1) % songs.length);

    }


    function previousSong() {

        setCurrentIndex(
            (currentIndex - 1 + songs.length) % songs.length
        );

    }


    function selectSong(index) {

        setCurrentIndex(index);

    }


    return (

        <>

            <Navbar />


            <main>

                <h1>
                    Welcome to EchoSphere 🎵
                </h1>

                <p>
                    Your Music Universe
                </p>


                <div className="songs">

                    {
                        songs.map((song, index) => (

                            <SongCard

                                key={index}

                                title={song.title}

                                artist={song.artist}

                                image={song.image}

                                songFile={song.file}

                                setCurrentSong={() => selectSong(index)}

                            />

                        ))
                    }

                </div>


                <Player

                    song={currentSong}

                    nextSong={nextSong}

                    previousSong={previousSong}

                />

            </main>

        </>

    );

}


export default App;