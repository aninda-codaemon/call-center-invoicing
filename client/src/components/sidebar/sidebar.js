import React, { useState, useEffect } from "react";
import "./sidebar.scss";
import SidebarNav from "../sidebarnav/sidebarnav";

function Sidebar() {
  const [height, setHeight] = useState({
    height: 0
  });

  const updateHeight = () => {
    setHeight({
      height: window.innerHeight - 60
    });
  };

  useEffect(() => {
    window.addEventListener("resize", updateHeight);
    window.addEventListener("load", updateHeight);
  }, []);

  return (
    <aside className="sidebar" style={height}>
      <SidebarNav/>
    </aside>
  );
}

export default Sidebar;
