import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import AsyncSelect from "react-select/async";
const Buffer = require("buffer/").Buffer;

const clientId = process.env.REACT_APP_CLIENT_ID;

const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

const authToken =
  "BQBWfqxjyoDMZ2OZXRo7o1wiVPBxG1E-2XVEmwTqLZekJ-memWXcLxJbeIU14k0Hw1ipn_nIsO3WPYbdoL0F-6sCcwxmaN8LNZh68SMBqJ8ANsfH9sEao1_0lzh02txfdbq212W21WUGyxXiuaGfZM1M4ur5g2u9B0oU0DtO4FG10YE-AIQD-uHQehAHRxnb";

function getRandomSearch() {
  // A list of all characters that can be chosen.
  const characters = "abcdefghijklmnopqrstuvwxyz";

  // Gets a random character from the characters string.
  const randomCharacter = characters.charAt(
    Math.floor(Math.random() * characters.length)
  );
  let randomSearch = "";

  // Places the wildcard character at the beginning, or both beginning and end, randomly.
  switch (Math.round(Math.random())) {
    case 0:
      randomSearch = randomCharacter + "%";
      break;
    case 1:
      randomSearch = "%" + randomCharacter + "%";
      break;
  }

  return randomSearch;
}

const App = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [isIndia, setIsIndia] = useState(false);
  const [isCustomPlaylist, setIsCustomPlaylist] = useState(false);
  const [searchTracks, setSearchTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState({});
  const [disableIndiaCheckbox, setDisableIndiaCheckbox] = useState(false);

  const handleClickRandomize = () => {
    if (authToken) {
      if (!isCustomPlaylist) {
        (async () => {
          axios({
            method: "get",
            url: "https://api.spotify.com/v1/search",
            headers: { Authorization: "Bearer " + authToken },
            params: {
              q: getRandomSearch(),
              type: "track",
              limit: 1,
              ...(isIndia && { market: "IN" }),
            },
          })
            .then((res) => {
              let songs = res.data.tracks.items.map((i) => ({
                name: i.name,
                url: i.external_urls.spotify,
              }));
              setTracks(songs);
              console.log(songs);
            })
            .catch((err) => {
              console.log(err);
            });
        })();
      } else {
        (async () => {
          axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}/songs`,
            params: {
              s: getRandomSearch(),
              limit: 1,
              ...(isIndia && { is_market_india: "yes" }),
            },
          })
            .then((res) => {
              let songs = res.data.body.map((i) => ({
                name: i.name,
                url: i.url,
              }));
              setTracks(songs);
              console.log(songs);
            })
            .catch((err) => {
              console.log(err);
            });
        })();
      }
    }
  };

  const handleCheckboxChange = (e) => {
    if (e.target.name === "is_india") setIsIndia(!isIndia);

    if (e.target.name === "is_custom") setIsCustomPlaylist(!isCustomPlaylist);
  };

  useEffect(() => {
    (async () => {
      axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        headers: {
          Authorization:
            "Basic " +
            new Buffer(clientId + ":" + clientSecret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        data: { grant_type: "client_credentials" },
        responseType: "json",
      })
        .then((res) => {
          setAuthToken(res.data.access_token);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  const loadOptions = (inputValue, callback) => {
    (async () => {
      axios({
        method: "get",
        url: "https://api.spotify.com/v1/search",
        headers: { Authorization: "Bearer " + authToken },
        params: {
          q: inputValue,
          type: "track",
          limit: 10,
        },
      })
        .then((res) => {
          const asyncOptions = res.data.tracks.items.map((item, idx) => ({
            label: item.name,
            value: idx,
          }));
          setSearchTracks(res.data.tracks.items);
          callback(asyncOptions);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  };

  const handleSelectChange = (value, action) => {
    let song = searchTracks[value.value];
    setSelectedTrack({
      name: song.name,
      url: song?.external_urls.spotify,
      is_market_india: song?.available_markets.includes("IN") ? "yes" : "no",
    });
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "grey",
      width: 250,
      innerHeight: 100,
    }),
    menu: (base) => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
      background: "grey",
    }),
  };

  const saveSongToPlaylist = () => {
    (async () => {
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/songs`,
        data: selectedTrack,
      })
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    })();
  };

  return (
    <div className="container">
      <div className="title">Song randomizer</div>
      <div className="app-container">
        <div className="randomize-container">
          <div className="checkbox-container">
            <label className="label">Indian market ?</label>
            <input
              name="is_india"
              type="checkbox"
              checked={isIndia}
              onChange={handleCheckboxChange}
              disabled={disableIndiaCheckbox}
            />
          </div>
          <div className="checkbox-container">
            <label className="label">Our custom playlist ?</label>
            <input
              name="is_custom"
              type="checkbox"
              checked={isCustomPlaylist}
              onChange={handleCheckboxChange}
            />
          </div>
          <button className="randomize-button" onClick={handleClickRandomize}>
            Randomize
          </button>
        </div>
        <div className="randomize-container">
          <AsyncSelect
            placeholder="Start typing a song name"
            loadOptions={loadOptions}
            defaultOptions
            styles={customStyles}
            theme={(theme) => ({
              ...theme,
              borderRadius: 5,
              colors: {
                ...theme.colors,
                primary25: "black",
                primary: "black",
              },
            })}
            onChange={handleSelectChange}
          />
          <button className="randomize-button" onClick={saveSongToPlaylist}>
            Add to playlist
          </button>
        </div>
      </div>
      <div className="song-container">
        {tracks.length > 0
          ? tracks.map((t) => (
              <div>
                <a href={t?.url} target="_blank">
                  {t.name}
                </a>
              </div>
            ))
          : "Add more songs to the playlist for a better random search"}
      </div>
    </div>
  );
};

export default App;
