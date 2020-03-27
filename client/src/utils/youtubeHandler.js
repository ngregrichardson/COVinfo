let searchYoutube = (term) => {
  return new Promise((res, rej) => {
    fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${
        process.env.REACT_APP_GOOGLE_API_KEY
      }&part=snippet&videoEmbeddable=true&q=${encodeURI(
        term
      )}&type=video&videoCategoryId=10`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.items) {
          res(json.items);
        } else {
          rej("No videos found");
        }
      })
      .catch((e) => rej(e));
  });
};

export default searchYoutube;
