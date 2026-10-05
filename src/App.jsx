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

    const [activePage, setActivePage] = useState("home");

    const [searchText, setSearchText] = useState("");

    const [searchResults, setSearchResults] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    const currentSong = songs[currentIndex];


    function nextSong() {
        setCurrentIndex(
            (currentIndex + 1) % songs.length
        );
    }


    function previousSong() {
        setCurrentIndex(
            (currentIndex - 1 + songs.length) % songs.length
        );
    }


    function selectSong(index) {
        setCurrentIndex(index);
    }


    /* =========================
       SMART SEARCH QUERY
    ========================= */

    function createSmartQuery(query) {

        const words = query
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .filter(Boolean);


        if (words.length === 0) {
            return "";
        }


        const parts = [];


        words.forEach((word) => {

            if (word.length >= 3) {

                parts.push(
                    `recording:${word}*`
                );

                parts.push(
                    `recording:${word}~0.7`
                );

                parts.push(
                    `artistname:${word}*`
                );

                parts.push(
                    `artistname:${word}~0.7`
                );

            } else {

                parts.push(
                    `recording:${word}*`
                );

                parts.push(
                    `artistname:${word}*`
                );

            }

        });


        return parts.join(" OR ");
    }


    /* =========================
       TEXT SIMILARITY
    ========================= */

    function calculateSimilarity(text, query) {

        const value = text
            .toLowerCase()
            .trim();

        const search = query
            .toLowerCase()
            .trim();


        if (!value || !search) {
            return 0;
        }


        if (value === search) {
            return 100;
        }


        if (value.startsWith(search)) {
            return 90;
        }


        if (value.includes(search)) {
            return 80;
        }


        const words = value.split(/\s+/);


        for (const word of words) {

            if (word.startsWith(search)) {
                return 85;
            }

        }


        return 0;
    }


    /* =========================
       SORT RESULTS BY RELEVANCE
    ========================= */

    function sortResults(results, query) {

        return [...results].sort((a, b) => {

            const aTitle =
                a.title || "";

            const bTitle =
                b.title || "";


            const aArtist =
                a["artist-credit"]?.[0]?.name || "";

            const bArtist =
                b["artist-credit"]?.[0]?.name || "";


            const aScore =
                Math.max(
                    calculateSimilarity(
                        aTitle,
                        query
                    ),
                    calculateSimilarity(
                        aArtist,
                        query
                    )
                );


            const bScore =
                Math.max(
                    calculateSimilarity(
                        bTitle,
                        query
                    ),
                    calculateSimilarity(
                        bArtist,
                        query
                    )
                );


            return bScore - aScore;
        });
    }


    /* =========================
       SEARCH MUSIC
    ========================= */

    async function searchMusic() {

        const query =
            searchText.trim();


        if (!query) {

            setSearchResults([]);

            setError(
                "Please enter a song or artist name."
            );

            return;
        }


        setLoading(true);

        setError("");

        setSearchResults([]);


        try {

            const smartQuery =
                createSmartQuery(query);


            const response =
                await fetch(
                    `/musicbrainz/recording/?query=${encodeURIComponent(
                        smartQuery
                    )}&fmt=json&limit=50`
                );


            if (!response.ok) {

                throw new Error(
                    "MusicBrainz request failed: " +
                    response.status
                );

            }


            const data =
                await response.json();


            const results =
                data.recordings || [];


            const sortedResults =
                sortResults(
                    results,
                    query
                );


            setSearchResults(
                sortedResults
            );


        } catch (err) {

            console.error(err);


            setError(
                "Unable to search MusicBrainz right now. Please try again."
            );

        } finally {

            setLoading(false);

        }

    }


    /* =========================
       ENTER KEY
    ========================= */

    function handleSearchKeyDown(event) {

        if (event.key === "Enter") {

            searchMusic();

        }

    }


    return (
        <>

            <Navbar
                activePage={activePage}
                setActivePage={setActivePage}
            />


            <main>


                {/* =========================
                    HOME
                ========================= */}

                {activePage === "home" && (
                    <>

                        <h1>
                            Welcome to EchoSphere
                        </h1>

                        <p>
                            Our Sound.
                        </p>


                        <div className="songs">

                            {songs.map(
                                (song, index) => (

                                    <SongCard
                                        key={index}
                                        title={song.title}
                                        artist={song.artist}
                                        image={song.image}
                                        songFile={song.file}
                                        setCurrentSong={() =>
                                            selectSong(index)
                                        }
                                    />

                                )
                            )}

                        </div>

                    </>
                )}


                {/* =========================
                    SEARCH
                ========================= */}

                {activePage === "search" && (
                    <>

                        <h1>
                            Search Music
                        </h1>

                        <p>
                            Search songs and artists from MusicBrainz.
                        </p>


                        <div className="search-box">

                            <input
                                type="text"
                                placeholder="Search songs or artists..."
                                value={searchText}
                                onChange={(e) =>
                                    setSearchText(
                                        e.target.value
                                    )
                                }
                                onKeyDown={
                                    handleSearchKeyDown
                                }
                            />


                            <button
                                onClick={
                                    searchMusic
                                }
                            >
                                Search
                            </button>

                        </div>


                        {/* Loading */}

                        {loading && (
                            <p>
                                Searching music...
                            </p>
                        )}


                        {/* Error */}

                        {!loading &&
                            error && (
                                <p>
                                    {error}
                                </p>
                            )}


                        {/* No Results */}

                        {!loading &&
                            !error &&
                            searchText &&
                            searchResults.length === 0 && (
                                <p>
                                    No music found.
                                </p>
                            )}


                        {/* Results */}

                        {!loading &&
                            searchResults.length > 0 && (

                                <div className="songs">

                                    {searchResults.map(
                                        (result) => {

                                            const releaseId =
                                                result
                                                    .releases?.[0]
                                                    ?.id;


                                            const artwork =
                                                releaseId
                                                    ? `https://coverartarchive.org/release/${releaseId}/front-250`
                                                    : "https://picsum.photos/200";


                                            return (

                                                <div
                                                    className="song-card"
                                                    key={result.id}
                                                >

                                                    <div className="song-image">

                                                        <img
                                                            src={artwork}
                                                            alt={
                                                                result.title ||
                                                                "Music"
                                                            }
                                                            onError={(
                                                                e
                                                            ) => {

                                                                e.currentTarget.src =
                                                                    "https://picsum.photos/200";

                                                            }}
                                                        />

                                                    </div>


                                                    <div className="song-info">

                                                        <h3>
                                                            {
                                                                result.title
                                                            }
                                                        </h3>


                                                        <p>
                                                            {
                                                                result[
                                                                    "artist-credit"
                                                                ]?.[0]
                                                                    ?.name ||
                                                                "Unknown Artist"
                                                            }
                                                        </p>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                    </>
                )}


                {/* =========================
                    LIBRARY
                ========================= */}

                {activePage === "library" && (
                    <>

                        <h1>
                            Your Library
                        </h1>

                        <p>
                            Your local music collection.
                        </p>


                        <div className="songs">

                            {songs.map(
                                (song, index) => (

                                    <SongCard
                                        key={index}
                                        title={song.title}
                                        artist={song.artist}
                                        image={song.image}
                                        songFile={song.file}
                                        setCurrentSong={() =>
                                            selectSong(index)
                                        }
                                    />

                                )
                            )}

                        </div>

                    </>
                )}


                {/* =========================
                    MUSIC PLAYER
                ========================= */}

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