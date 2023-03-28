import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import RootHeader from "../components/RootHeader";

const RootLayout = () => {
  const [showSidebar, setShowSidebar] = useState(
    window.innerWidth <= 600 ? false : true
  );

  const toggleSidebarHandler = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <>
      <div
        className={`root__overlay ${
          showSidebar ? "root__overlay--visible" : "root__overlay--hidden"
        }`}
        onClick={toggleSidebarHandler}
      ></div>
      <RootHeader toggleSidebar={toggleSidebarHandler} />
      <Outlet context={{ showSidebar: showSidebar }} />
    </>
  );
};

export default RootLayout;
