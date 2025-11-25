import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const url = import.meta.env.BASE_URL;

const API_BASE = url || "";

export default function Stats() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/links/${code}`);
        if (res.status === 404) {
          setErr("Not found");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setLink(data);
      } catch {
        setErr("Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  if (loading) return <p>Loading...</p>;
  if (err) return <p>{err}</p>;

  return (
    <div className="card">
      <h2>Stats for {link.code}</h2>
      <p>
        <strong>Short URL</strong>:{" "}
        <a href={`${API_BASE}/${link.code}`} target="_blank" rel="noreferrer">
          {API_BASE}/{link.code}
        </a>
      </p>
      <p>
        <strong>Target</strong>:{" "}
        <a href={link.long_url} target="_blank" rel="noreferrer">
          {link.long_url}
        </a>
      </p>
      <p>
        <strong>Clicks</strong>: {link.clicks}
      </p>
      <p>
        <strong>Last clicked</strong>:{" "}
        {link.last_clicked ? new Date(link.last_clicked).toLocaleString() : "-"}
      </p>
      <p>
        <strong>Created</strong>: {new Date(link.created_at).toLocaleString()}
      </p>
    </div>
  );
}
