import React, { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard").then((r) => {});
  }, []);

  return <></>;
}

export default MyApp;
