import React from "react";
import { Link } from "react-router-dom";

const url = import.meta.env.VITE_BACKEND_URL;

const API_BASE = url || "";

export default function LinkRow({ link, onDelete }) {
  const shortUrl = `${API_BASE || ""}/${link.code}`;
  async function ondelete() {
    onDelete(link.code);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert("Copied");
    } catch {
      alert("Copy failed");
    }
  }

  return (
    <tr className="each-row">
      <td>
        <Link to={`/code/${link.code}`}>{link.code}</Link>
      </td>
      <td className="truncate">
        <a href={link.longUrl} target="_blank" rel="noreferrer">
          {link.longUrl}
        </a>
      </td>
      <td>{link.clicks}</td>
      <td>
        {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "-"}
      </td>
      <td>
        <button onClick={copy} className="small">
          Copy
        </button>
        <a
          href={`${API_BASE}/${link.code}`}
          target="_blank"
          rel="noreferrer"
          className="small"
        >
          Open
        </a>
        <button onClick={ondelete} className="small danger">
          Delete
        </button>
      </td>
    </tr>
  );
}
