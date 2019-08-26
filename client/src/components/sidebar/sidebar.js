import React, { useState, useEffect } from "react";
import "./sidebar.scss";
import SidebarNav from "../sidebarnav/sidebarnav";

function Sidebar() {
  const [height, setHeight] = useState({
    height: 0
  });

  const updateHeight = () => {
    setHeight({
      height: document.documentElement.scrollHeight - 60
    });
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      updateHeight();
      window.addEventListener("resize", updateHeight);
    }
    return () => {
      mounted = false;
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <aside className="sidebar" style={height}>
      <SidebarNav />
    </aside>
  );
}

export default Sidebar;
