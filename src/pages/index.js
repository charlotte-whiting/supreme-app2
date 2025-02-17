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
        console.log(json);
        setHello(JSON.stringify(json.message));
      } catch (error) {
        console.error(error.message);
      }
    };

    makeCall();
  });
  return (
    <div>
      {hello} <Link href="/about">About</Link>
      <Image
        src={"/charlatte.jpeg"}
        alt="charlatte car"
        width="164"
        height="164"
      />
    </div>
  );
}
