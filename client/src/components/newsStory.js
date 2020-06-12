import React, { useState } from "react";
import moment from "moment";
import { useMediaQuery } from "react-responsive";

function NewsStory(props) {
  const [article] = useState(props.article);
  const isSmallDevice = useMediaQuery({
    query: "(max-device-width: 1024px)",
  });

  let openArticleLink = () => {
    window.open(article.url, "_blank");
  };

  return (
    <button
      className="p-2 text-white d-flex flex-row align-items-center mb-3 text-left w-100 bg-transparent border newsStory"
      style={{ borderRadius: 10, borderColor: "lightgray" }}
      onClick={openArticleLink}
    >
      <img
        src={
          article.urlToImage ||
          "https://designshack.net/wp-content/uploads/placeholder-image.png"
        }
        style={{ borderRadius: 5, objectFit: "cover", width: 70, height: 70 }}
        alt={"article_img"}
      />
      <div className="d-flex flex-column justify-content-center ml-3">
        <h5 className={isSmallDevice ? "mb-0 text-dark h6" : "mb-0 text-dark"}>
          {article.title}
        </h5>
        <span
          className="pl-2 h6 text-black-50"
          style={{ overflowWrap: "anywhere" }}
        >
          {article.source.name} ·
          {!isSmallDevice
            ? article.author && article.author.trim() !== ""
              ? ` ${article.author} · `
              : " "
            : " "}
          {moment(article.publishedAt).fromNow()}
        </span>
      </div>
    </button>
  );
}

export default NewsStory;
