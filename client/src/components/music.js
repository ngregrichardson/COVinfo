import React, { useEffect, useState } from "react";
import searchYoutube from "../utils/youtubeHandler";
import firebase from "firebase";
import moment from "moment";
import ReactPlayer from "react-player";
import {
  Search,
  ThumbsUp,
  UploadCloud,
  Filter,
  BarChart,
  Clock,
  Trash,
} from "react-feather";
import { connect } from "react-redux";
import HashLoader from "react-spinners/HashLoader";
import { Button, Form, Modal, Dropdown } from "react-bootstrap";
import InputMask from "react-input-mask";
import { Scrollbars } from "react-custom-scrollbars";

function Music(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedSongs, setSearchedSongs] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [addSongModalVisible, setAddSongModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [timestamp, setTimestamp] = useState("00:00:00");
  const [sortType, setSortType] = useState("popular");

  let loadSongs = () => {
    firebase
      .firestore()
      .collection("songs")
      .get()
      .then((snapshot) => {
        let temp = [];
        snapshot.forEach((song) => temp.push(song.data()));
        setSongs(sortSongs(temp));
        setLoading(false);
        setForceUpdate(!forceUpdate);
      });
  };

  useEffect(() => {
    document.title = "Music | COVInfo";
    loadSongs();
  }, []);

  let changeSortType = async (type) => {
    if (sortType !== type) {
      setSortType(type);
      setSongs(sortSongs(songs, type));
      setForceUpdate(!forceUpdate);
    }
  };

  let sortSongs = (sngs, type = sortType) => {
    switch (type) {
      case "recent":
        sngs.sort((a, b) => {
          return moment(b.created_at) - moment(a.created_at);
        });
        break;
      default:
        sngs.sort((a, b) => b.upvotes.length - a.upvotes.length);
        break;
    }
    return sngs;
  };

  let addSong = () => {
    if (selectedSong !== null) {
      let newSong = {
        url: `https://youtube.com/watch?v=${selectedSong.id.videoId}`,
        title: selectedSong.snippet.title,
        seconds: parseTimestamp(),
        created_at: moment().toISOString(),
        upvotes: [],
        user: props.user,
        song_id: "",
      };
      firebase
        .firestore()
        .collection("songs")
        .add(newSong)
        .then((docRef) => {
          firebase
            .firestore()
            .collection("songs")
            .doc(docRef.id)
            .update({ song_id: docRef.id })
            .then(() => {
              let temp = songs;
              temp.push({ ...newSong, song_id: docRef.id });
              setSongs(sortSongs(temp));
              setSearchTerm("");
              closeAddSongModal();
            })
            .catch((e) => console.log(e));
        });
    }
  };

  let _handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchForSong();
    }
  };

  let searchForSong = () => {
    if (searchTerm.trim() !== "") {
      searchYoutube(searchTerm)
        .then((songs) => {
          setSearchedSongs(songs);
          setAddSongModalVisible(true);
        })
        .catch((e) => console.log(e));
    } else {
      setSearchedSongs([]);
    }
  };

  let parseTimestamp = () => {
    let durs = timestamp.split(":");
    let hours = parseInt(durs[0]);
    let minutes = parseInt(durs[1]);
    let seconds = parseInt(durs[2]);
    return (
      moment.duration(hours, "hours").asSeconds() +
      moment.duration(minutes, "minutes").asSeconds() +
      seconds
    );
  };

  let decodeHtmlEntity = (str) => {
    return str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
    });
  };

  let closeAddSongModal = () => {
    setAddSongModalVisible(false);
    setTimestamp("00:00:00");
    setSelectedSong(null);
    setSearchedSongs([]);
  };

  let toggleUpvote = (song_id) => {
    let index = songs.findIndex((s) => s.song_id === song_id);
    let upvotes = songs[index].upvotes;
    if (upvotes.includes(props.user.user_id)) {
      upvotes = upvotes.filter((user_id) => user_id !== props.user.user_id);
    } else {
      upvotes.push(props.user.user_id);
    }
    let temp = songs;
    temp[index] = { ...temp[index], upvotes };
    firebase
      .firestore()
      .collection("songs")
      .doc(song_id)
      .update({ upvotes })
      .then(() => {
        setSongs(sortSongs(temp));
        setForceUpdate(!forceUpdate);
      })
      .catch((e) => console.log(e));
  };

  let deleteSong = (song_id) => {
    if (window.confirm("Are you sure you want to delete that song?")) {
      firebase
        .firestore()
        .collection("songs")
        .doc(song_id)
        .delete()
        .then(() => {
          setSongs(sortSongs(songs.filter((song) => song.song_id !== song_id)));
          setForceUpdate(!forceUpdate);
        });
    }
  };

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <Modal show={addSongModalVisible} onHide={closeAddSongModal}>
        <Modal.Header closeButton>
          <Modal.Title>Suggest A Song</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {searchedSongs.map((song) => (
              <button
                className={`w-100 border-0 ${
                  selectedSong
                    ? song.id.videoId === selectedSong.id.videoId
                      ? "border-info"
                      : "bg-transparent"
                    : "bg-transparent"
                }`}
                onClick={() => setSelectedSong(song)}
              >
                <div className="d-flex flex flex-row align-items-center my-2">
                  <img
                    src={song.snippet.thumbnails.default.url}
                    width={song.snippet.thumbnails.default.width * (2 / 3)}
                    height={song.snippet.thumbnails.default.height * (2 / 3)}
                    alt={"thumbnail"}
                  />
                  <div className="ml-2 text-left">
                    <h5 className="mb-0 text-dark">
                      {decodeHtmlEntity(song.snippet.title)}
                    </h5>
                    <span className="ml-2 h6 text-black-50">
                      {song.snippet.channelTitle} ·
                      {moment(song.snippet.publishedAt).fromNow()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <Form.Group>
            <Form.Label>Timestamp</Form.Label>
            <InputMask
              mask={"99:99:99"}
              defaultValue={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            >
              {(inputProps) => <Form.Control type={"text"} {...inputProps} />}
            </InputMask>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="d-flex flex-row align-items-center"
            onClick={addSong}
          >
            <UploadCloud className="mr-1" /> Suggest Song
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="w-100 px-3 mt-3">
        <h3>Hand Washing Music</h3>
        <div className="w-100 d-flex flex-row rounded-pill messageInputContainer">
          <input
            type={"text"}
            className="flex bg-transparent border-0 py-2 px-3 messageInput"
            placeholder="Add song from YouTube..."
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={_handleKeyPress}
            value={searchTerm}
          />
          {searchTerm.trim() !== "" ? (
            <button
              className="bg-primary border-0 d-flex align-items-center justify-content-center pl-3 pr-4"
              style={{
                borderTopRightRadius: 100,
                borderBottomRightRadius: 100,
              }}
              onClick={searchForSong}
            >
              <Search color={"white"} />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
      {loading ? (
        <div className="d-flex align-items-center justify-content-center w-100 flex">
          <HashLoader size={75} />
        </div>
      ) : (
        <div className="h-100 p-3">
          <Dropdown className="mb-3 d-flex justify-content-end">
            <Dropdown.Toggle variant="light">
              Filter <Filter />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => changeSortType("popular")}
                style={{
                  backgroundColor:
                    sortType === "popular" ? "lightgray" : "white",
                }}
              >
                <div className="d-flex flex-row align-items-center">
                  <span className="flex">Popular</span> <ThumbsUp />
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => changeSortType("recent")}
                style={{
                  backgroundColor:
                    sortType === "recent" ? "lightgray" : "white",
                }}
              >
                <div className="d-flex flex-row align-items-center">
                  <span className="flex">Recent</span> <Clock />
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Scrollbars
            hideTracksWhenNotNeeded
            renderView={(props) => <div {...props} />}
          >
            {songs.map((song) => (
              <div
                className="border d-inline-block m-1"
                style={{ borderRadius: 10, borderColor: "lightgray" }}
                key={song.song_id}
              >
                <ReactPlayer
                  url={`${song.url}&t=${song.seconds}`}
                  controls={false}
                  className="m-2"
                  width={640 * (2 / 3) - 30}
                  height={360 * (2 / 3) - 30}
                />
                <div
                  style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "lightgray",
                  }}
                />
                <div className="p-2 d-flex flex-row align-items-center">
                  <div className="flex">
                    <span>Submitted by: </span>
                    <span style={{ color: `#${song.user.username_color}` }}>
                      {song.user.username}
                    </span>
                  </div>
                  {props.authed ? (
                    <div className="d-flex flex-row align-items-center">
                      {props.user.type === "admin" ? (
                        <button
                          className="bg-transparent border-0"
                          onClick={() => deleteSong(song.song_id)}
                        >
                          <Trash className="text-danger" />
                        </button>
                      ) : null}
                      <span>({song.upvotes.length})</span>
                      <button
                        className="bg-transparent border-0"
                        onClick={() => toggleUpvote(song.song_id)}
                      >
                        <ThumbsUp
                          color={
                            song.upvotes.includes(props.user.user_id)
                              ? "gold"
                              : "black"
                          }
                        />
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            ))}
          </Scrollbars>
        </div>
      )}
    </div>
  );
}

let mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user, authed: state.authed };
};

export default connect(mapStateToProps)(Music);
