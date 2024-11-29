import React, { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return <div className=" md:p-6 p-4">{children}</div>;
};

export default RootLayout;
