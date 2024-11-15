import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return <div className=" p-6">{children}</div>;
};

export default RootLayout;
