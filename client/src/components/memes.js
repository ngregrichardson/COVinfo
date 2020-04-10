import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase";
import moment from "moment";
import {
  ThumbsUp,
  UploadCloud,
  Filter,
  Image,
  Clock,
  Trash,
} from "react-feather";
import { connect } from "react-redux";
import HashLoader from "react-spinners/HashLoader";
import { Button, Modal, Dropdown, ProgressBar } from "react-bootstrap";
import { Scrollbars } from "react-custom-scrollbars";
import Dropzone from "react-dropzone";
import Masonry from "react-masonry-component";
import { useToasts } from "react-toast-notifications";
import ReactCountryFlag from "react-country-flag";

function Memes(props) {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [addMemeModalVisible, setAddMemeModalVisible] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(<Image size={100} />);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [memeToUpload, setMemeToUpload] = useState(null);
  const [sortType, setSortType] = useState("popular");
  const [uploadingProgress, setUploadingProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const widthRef = useRef(null);
  const { addToast } = useToasts();

  let loadMemes = () => {
    firebase
      .firestore()
      .collection("memes")
      .get()
      .then((snapshot) => {
        let temp = [];
        snapshot.forEach((meme) => temp.push(meme.data()));
        setMemes(sortMemes(temp));
        setLoading(false);
        setForceUpdate(!forceUpdate);
      })
      .catch((e) => {
        console.log(e);
        addToast("There was a problem loading the memes.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  useEffect(() => {
    loadMemes();
  }, []);

  let changeSortType = async (type) => {
    if (sortType !== type) {
      setSortType(type);
      setMemes(sortMemes(memes, type));
      setForceUpdate(!forceUpdate);
      addToast(`Filtering by ${type}.`, {
        appearance: "success",
        autoDismiss: true,
      });
    }
  };

  let sortMemes = (mms, type = sortType) => {
    switch (type) {
      case "recent":
        mms.sort((a, b) => {
          return moment(b.created_at) - moment(a.created_at);
        });
        break;
      default:
        mms.sort((a, b) => b.upvotes.length - a.upvotes.length);
        break;
    }
    return mms;
  };

  let addMeme = () => {
    if (memeToUpload) {
      setUploading(true);
      let newMeme = {
        url: "",
        created_at: "",
        upvotes: [],
        user: props.user,
        meme_id: "",
      };
      firebase
        .firestore()
        .collection("memes")
        .add(newMeme)
        .then((docRef) => {
          newMeme.meme_id = docRef.id;
          let uploadTask = firebase
            .storage()
            .ref(`images/${newMeme.meme_id}`)
            .put(memeToUpload);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setUploadingProgress(progress);
            },
            (e) => {
              console.log(e);
              addToast("There was a problem adding the meme.", {
                appearance: "error",
                autoDismiss: true,
              });
            },
            () => {
              firebase
                .storage()
                .ref("images")
                .child(newMeme.meme_id)
                .getDownloadURL()
                .then((url) => {
                  newMeme.url = url;
                  newMeme.created_at = moment().toISOString();
                  firebase
                    .firestore()
                    .collection("memes")
                    .doc(newMeme.meme_id)
                    .update(newMeme)
                    .then(() => {
                      let temp = memes;
                      temp.push(newMeme);
                      setMemes(sortMemes(temp));
                      setUploading(false);
                      closeAddMemeModal();
                      addToast("Meme added.", {
                        appearance: "success",
                        autoDismiss: true,
                      });
                    })
                    .catch((e) => {
                      console.log(e);
                      addToast("There was a problem adding the meme.", {
                        appearance: "error",
                        autoDismiss: true,
                      });
                    });
                })
                .catch((e) => {
                  console.log(e);
                  addToast("There was a problem adding the meme.", {
                    appearance: "error",
                    autoDismiss: true,
                  });
                });
            }
          );
        })
        .catch((e) => {
          console.log(e);
          addToast("There was a problem adding the meme.", {
            appearance: "error",
            autoDismiss: true,
          });
        });
    }
  };

  let closeAddMemeModal = () => {
    setAddMemeModalVisible(false);
    setMemeToUpload(null);
  };

  let toggleUpvote = (meme_id) => {
    let index = memes.findIndex((meme) => meme.meme_id === meme_id);
    let upvotes = memes[index].upvotes;
    if (upvotes.includes(props.user.user_id)) {
      upvotes = upvotes.filter((user_id) => user_id !== props.user.user_id);
    } else {
      upvotes.push(props.user.user_id);
    }
    let temp = memes;
    temp[index] = { ...temp[index], upvotes };
    firebase
      .firestore()
      .collection("memes")
      .doc(meme_id)
      .update({ upvotes })
      .then(() => {
        setMemes(sortMemes(temp));
        setForceUpdate(!forceUpdate);
        addToast("Upvote toggled.", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((e) => {
        console.log(e);
        addToast("There was a problem toggling the upvote.", {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  let deleteMeme = (meme_id) => {
    if (window.confirm("Are you sure you want to delete that meme?")) {
      firebase
        .firestore()
        .collection("memes")
        .doc(meme_id)
        .delete()
        .then(() => {
          firebase
            .storage()
            .ref(`images/${meme_id}`)
            .delete()
            .then(() => {
              setMemes(
                sortMemes(memes.filter((meme) => meme.meme_id !== meme_id))
              );
              setForceUpdate(!forceUpdate);
              addToast("The meme was deleted.", {
                appearance: "success",
                autoDismiss: true,
              });
            })
            .catch((e) => {
              console.log(e);
              addToast("There was a problem deleting the meme.", {
                appearance: "error",
                autoDismiss: true,
              });
            });
        })
        .catch((e) => {
          console.log(e);
          addToast("There was a problem deleting the meme.", {
            appearance: "error",
            autoDismiss: true,
          });
        });
    }
  };

  return (
    <div className="w-100 h-100 d-flex flex-column" ref={widthRef}>
      <Modal show={addMemeModalVisible} onHide={closeAddMemeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Upload a Meme</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          {memeToUpload ? (
            <button
              className="bg-transparent border-0 position-relative"
              onMouseEnter={() => setDeleteHovered(true)}
              onMouseLeave={() => setDeleteHovered(false)}
              onClick={() => setMemeToUpload(null)}
            >
              <img
                src={URL.createObjectURL(memeToUpload)}
                alt={"memeToUpload"}
                style={{ borderRadius: 5 }}
              />
              {deleteHovered ? (
                <div
                  className="position-absolute d-flex flex-row align-items-center justify-content-center"
                  style={{
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  <Trash className="text-danger" size={50} />
                </div>
              ) : (
                <div />
              )}
            </button>
          ) : (
            <Dropzone
              onDrop={(acceptedFiles) => setMemeToUpload(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div
                    {...getRootProps({
                      className: "dropzone",
                      onMouseEnter: () =>
                        setUploadingImage(<UploadCloud size={100} />),
                      onMouseLeave: () =>
                        setUploadingImage(<Image size={100} />),
                    })}
                  >
                    <input
                      {...getInputProps({
                        multiple: false,
                        accept: "image/png, image/jpeg, image/gif",
                      })}
                    />
                    {uploadingImage}
                    <span>
                      Drag 'n' drop some files here, or click to select files
                    </span>
                  </div>
                </section>
              )}
            </Dropzone>
          )}
          {uploading ? (
            <ProgressBar
              now={uploadingProgress}
              label={`${uploadingProgress}%`}
              className="w-100 mt-2"
            />
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="d-flex flex-row align-items-center"
            onClick={addMeme}
          >
            <UploadCloud className="mr-1" /> Upload Meme
          </Button>
        </Modal.Footer>
      </Modal>
      <h3 className="px-3 pt-3">Coronavirus Memes</h3>
      <div className="d-flex flex-row align-items-center justify-content-between mb-3 px-3">
        <Button
          variant="success"
          onClick={() => setAddMemeModalVisible(true)}
          disabled={!props.authed}
        >
          {props.authed ? "+ Add Meme" : "Login to add memes"}
        </Button>
        <Dropdown>
          <Dropdown.Toggle variant="light">
            Filter <Filter />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => changeSortType("popular")}
              style={{
                backgroundColor: sortType === "popular" ? "lightgray" : "white",
              }}
            >
              <div className="d-flex flex-row align-items-center">
                <span className="flex">Popular</span> <ThumbsUp />
              </div>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => changeSortType("recent")}
              style={{
                backgroundColor: sortType === "recent" ? "lightgray" : "white",
              }}
            >
              <div className="d-flex flex-row align-items-center">
                <span className="flex">Recent</span> <Clock />
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {loading ? (
        <div className="d-flex align-items-center justify-content-center w-100 flex">
          <HashLoader size={75} />
        </div>
      ) : (
        <div className="flex p-3">
          <Scrollbars
            hideTracksWhenNotNeeded
            renderView={(props) => <div {...props} />}
          >
            <Masonry className="pb-5">
              {memes.map((meme) => (
                <div
                  className="border d-inline-block m-1"
                  style={{
                    borderRadius: 10,
                    borderColor: "lightgray",
                    width: widthRef.current
                      ? widthRef.current.offsetWidth / 4 + 30
                      : 0,
                  }}
                  key={meme.meme_id}
                >
                  <img
                    src={meme.url}
                    alt={meme.meme_id}
                    className="w-100 p-2"
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
                      <span style={{ color: `#${meme.user.username_color}` }}>
                        {meme.user.username}
                      </span>
                      <ReactCountryFlag countryCode={meme.user.country} svg className="rounded ml-1"/>
                    </div>
                    <div className="d-flex flex-row align-items-center">
                      {props.authed && props.user.type === "admin" ? (
                        <button
                          className="bg-transparent border-0"
                          onClick={() => deleteMeme(meme.meme_id)}
                        >
                          <Trash className="text-danger" />
                        </button>
                      ) : null}
                      <span>({meme.upvotes.length})</span>
                      <button
                        className="bg-transparent border-0"
                        onClick={() => toggleUpvote(meme.meme_id)}
                        disabled={!props.authed}
                        title={
                          !props.authed ? "Login to enable upvoting" : null
                        }
                      >
                        <ThumbsUp
                          color={
                            props.authed &&
                            meme.upvotes.includes(props.user.user_id)
                              ? "gold"
                              : "black"
                          }
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>
          </Scrollbars>
        </div>
      )}
    </div>
  );
}

let mapStateToProps = (state, ownProps) => {
  return { ...ownProps, user: state.user, authed: state.authed };
};

export default connect(mapStateToProps)(Memes);
