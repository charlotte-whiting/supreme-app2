import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [hello, setHello] = useState("Hello World");

  useEffect(() => {
    const makeCall = async () => {
      try {
        const res = await fetch("/api/hello");
        if (!res.ok) {
          throw new Error(`Response status: ${res.status}`);
        }
        const json = await res.json();
        setHello(JSON.stringify(json.message));
      } catch (error) {
        console.error(error.message);
      }
    };

    makeCall();
  });
  return (
    <div>
      <br />
      <Link href="/comic_pricing"> comic price estimation feature</Link>
      <br />
      coming soon: other media recommendations
    </div>
  );
}
