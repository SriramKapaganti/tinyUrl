import { useEffect, useState } from "react";
import LinkRow from "../components/linkrow";
import Navbar from "../components/navbar";

const UserlinksSheet = () => {
  const [userlinks, setUserLink] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserLinks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/links`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setUserLink([...data]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getUserLinks();
  });
  async function deleteLink(code) {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/links/${code}`, {
        method: "DELETE",
        credentials: "include",
      });
      setUserLink((prev) => prev.filter((l) => l.code !== code));
    } catch {
      alert("Failed to delete");
    }
  }
  if (loading) return <p>Loading...</p>;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Navbar />
      <table style={{ width: "100%", alignSelf: "center", marginTop: "30px" }}>
        <thead>
          <tr>
            <th>code</th>
            <th>Long URL</th>
            <th>Clicks</th>
            <th>Last Clicked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userlinks.map((link) => (
            <LinkRow onDelete={deleteLink} key={link.code} link={link} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserlinksSheet;
