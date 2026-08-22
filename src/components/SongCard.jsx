function SongCard({
    title,
    artist,
    image,
    songFile,
    setCurrentSong
}) {

    function play() {

        console.log("Selected Song:", title);

        setCurrentSong({
            title: title,
            artist: artist,
            file: songFile,
            image: image
        });

    }

    return (

        <div className="song-card">

            <div className="song-image">

                <img
                    src={image}
                    alt={title}
                />

                <button
                    className="card-play"
                    onClick={play}
                >
                    ▶
                </button>

            </div>


            <div className="song-info">

                <h3>
                    {title}
                </h3>

                <p>
                    {artist}
                </p>

            </div>


            <button
                className="play-button"
                onClick={play}
            >
                ▶ Play
            </button>

        </div>

    );
}

export default SongCard;