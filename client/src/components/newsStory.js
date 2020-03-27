import React, { useState } from "react";
import moment from "moment";

function NewsStory(props) {
  const [article] = useState(props.article);

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
        width={70}
        height={70}
        style={{ borderRadius: 5, objectFit: "cover" }}
        alt={"article_img"}
      />
      <div className="d-flex flex-column justify-content-center ml-3">
        <h5 className="mb-0 text-dark">{article.title}</h5>
        <span className="ml-2 h6 text-black-50">
          {article.source.name} ·
          {article.author && article.author.trim() !== ""
            ? ` ${article.author} · `
            : " "}
          {moment(article.publishedAt).fromNow()}
        </span>
      </div>
    </button>
  );
}

export default NewsStory;
