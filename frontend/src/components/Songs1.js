import { Box, Button, Checkbox, InputLabel } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { ToastContext } from "./../context/toastProvider";
import { successToast, errorToast } from "./../utils/toastHelper";
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

const Songs1 = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [isIndia, setIsIndia] = useState(false);
  const [isCustomPlaylist, setIsCustomPlaylist] = useState(false);
  const [searchTracks, setSearchTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState({});
  const [disableIndiaCheckbox, setDisableIndiaCheckbox] = useState(false);
  const [_, toastDispatch] = useContext(ToastContext);

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
              successToast(toastDispatch, "Found a song from spotify");
            })
            .catch((err) => {
              errorToast(
                toastDispatch,
                "Something went wrong while fetching a random song from spotify",
                []
              );
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
              let mes = "Found a song from custom playlist";
              if (songs.length <= 0)
                mes = "Please add more songs to the custom playlist";
              successToast(toastDispatch, mes);
            })
            .catch((err) => {
              errorToast(
                toastDispatch,
                "Something went wrong while fetching a random song from custom playlist",
                []
              );
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
          errorToast(toastDispatch, "Something went wrong !!", []);
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
          errorToast(
            toastDispatch,
            "Something went wrong in setting options for dynamic select",
            []
          );
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
        .then((res) => {
          successToast(toastDispatch, res.data.message);
        })
        .catch((err) => {
          errorToast(
            toastDispatch,
            err.response.data.message,
            err.response.data.body
          );
        });
    })();
  };
  return (
    <Box
      sx={{
        backgroundColor: "rgba(1, 1, 14, 0.863)",
        margin: "auto",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Box
        name="title"
        sx={{
          padding: "10px",
          textAlign: "center",
          fontSize: { xs: "25px", md: "50px" },
          textDecoration: "underline",
        }}
      >
        Song Randomizer
      </Box>
      <Box
        name="main-container"
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <Box
          name="input-container"
          sx={{
            minHeight: "50vh",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            color: "white",
          }}
        >
          <Box
            name="randomize-container"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "flex-end",
              margin: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <InputLabel sx={{ color: "white" }}>Indian market ?</InputLabel>
              <Checkbox
                name="is_india"
                checked={isIndia}
                onChange={handleCheckboxChange}
                disabled={disableIndiaCheckbox}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <InputLabel sx={{ color: "white" }}>
                Our custom playlist ?
              </InputLabel>
              <Checkbox
                name="is_custom"
                checked={isCustomPlaylist}
                onChange={handleCheckboxChange}
              />
            </Box>
            <Button
              sx={{
                border: "none",
                backgroundColor: "grey",
                cursor: "pointer",
                padding: { md: "15px 32px", xs: "10px 25px" },
                fontSize: "16px",
                color: "white",
                borderRadius: "5px",
                width: "250px",
                ":hover": {
                  backgroundColor: "rgb(224, 219, 219)",
                  color: "black",
                },
              }}
              onClick={handleClickRandomize}
            >
              Randomize
            </Button>
          </Box>
          <Box
            name="randomize-container"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "flex-end",
              margin: "auto",
            }}
          >
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
            <Button
              sx={{
                border: "none",
                backgroundColor: "grey",
                cursor: "pointer",
                padding: { md: "15px 32px", xs: "10px 25px" },
                fontSize: "16px",
                color: "white",
                borderRadius: "5px",
                width: "250px",
                ":hover": {
                  backgroundColor: "rgb(224, 219, 219)",
                  color: "black",
                },
              }}
              onClick={saveSongToPlaylist}
            >
              Add to playlist
            </Button>
          </Box>
        </Box>
        <Box
          name="songs-container"
          sx={{ backgroundColor: "yellow", minHeight: "50vh" }}
        >
          Songs display Container
        </Box>
      </Box>
    </Box>
  );
};

export default Songs1;
