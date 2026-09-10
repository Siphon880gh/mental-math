import { Link, useParams } from "react-router-dom";
import ChunkAdder from "../games/ChunkAdder";
import DecimalShift from "../games/DecimalShift";
import PercentSwap from "../games/PercentSwap";
import { getGame } from "../lib/games";

const COMPONENTS = {
  "decimal-shift": DecimalShift,
  "percent-swap": PercentSwap,
  "percent-chips": ChunkAdder,
} as const;

export default function GameHost() {
  const { slug = "" } = useParams();
  const meta = getGame(slug);
  const View = COMPONENTS[slug as keyof typeof COMPONENTS];
  if (!meta || !View) {
    return (
      <section>
        <h2>Game not found</h2>
        <p>Unknown slug: {slug}</p>
        <Link to="/games">All games</Link>
      </section>
    );
  }
  return <View />;
}
