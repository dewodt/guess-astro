"use client";

import NavBar from "@/components/ui/navbar";
import { useState } from "react";

const NavBarTest = () => {
  const [navBarExpanded, setNavBarExpanded] = useState(false);
  return (
    <NavBar
      navBarExpanded={navBarExpanded}
      setNavBarExpanded={setNavBarExpanded}
    />
  );
};

export default NavBarTest;
