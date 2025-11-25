import React, { useState } from "react";
import Navbar from "../components/navbar";
import UrlShortener from "../components/urlShortner";

const Dashboard = () => {
  useState(() => {});
  return (
    <div style={{ width: "100wh" }}>
      <Navbar />
      <UrlShortener />
    </div>
  );
};

export default Dashboard;
