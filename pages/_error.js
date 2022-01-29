import React, { useEffect } from "react";
import Router from "next/router";

export default function _error() {
  useEffect(() => {
    Router.push("/admin/errors");
  });

  return <div />;
}
