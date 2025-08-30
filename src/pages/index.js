import { Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Stack>
      <Typography align="center">Welcome to supreme-app!</Typography>
      <Stack direction={"row"}>
        <Link href="/comics/comic_pricing">comic price estimation feature</Link>
        <Link href="/extended_info">other media recommendations</Link>
      </Stack>
    </Stack>
  );
}
