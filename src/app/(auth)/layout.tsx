import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <div className=" flex justify-center pt-8">{children}</div>;
};

export default Layout;
