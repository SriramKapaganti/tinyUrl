import { useState } from "react";
import "./component.css";

const UrlShortener = () => {
  const [userRequest, setUserRequest] = useState({
    long_url: "",
    code: "",
  });
  const [apiResponse, setApiResponses] = useState(null);

  const onchangeinform = (event) => {
    const { name, value } = event.target;
    setUserRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onCall = async (event) => {
    event.preventDefault();
    const API_BASE = import.meta.env.VITE_BACKEND_URL || "";
    console.log(API_BASE);
    const response = await fetch(`${API_BASE}/api/links`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userRequest),
    });
    const data = await response.json();
    console.log(data);

    setApiResponses(data);
  };

  return (
    <div className="form-container">
      <form className="shortern-form" onSubmit={onCall}>
        <div className="form-items-container">
          <label htmlFor="url" className="shortern-form-tag">
            URL
          </label>
          <input
            type="text"
            id="url"
            name="long_url"
            className="form-input-box"
            onChange={onchangeinform}
          />
        </div>
        <div className="form-items-container">
          <label htmlFor="code" className="shortern-form-tag">
            CUSTOM CODE
          </label>
          <input
            type="text"
            id="code"
            name="code"
            className="form-input-box"
            onChange={onchangeinform}
          />
        </div>
        <button type="submit">Convert</button>
      </form>
      {apiResponse && (
        <div className="result-container">
          <h1 className="result-header">Url Detials</h1>
          <ul className="url-details">
            {Object.entries(apiResponse).map(([key, value], index) => (
              <li key={index} className="url-items">
                <strong>{key}</strong>: {String(value)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
