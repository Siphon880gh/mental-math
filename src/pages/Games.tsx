import { Link } from "react-router-dom";
import { GAMES } from "../lib/games";

export default function Games() {
  return (
    <section>
      <h2>Mini-games</h2>
      <p className="lede">One mechanic each. Not another typed drill.</p>
      <ul className="cards">
        {GAMES.map((game) => (
          <li key={game.slug}>
            <Link to={`/games/${game.slug}`}>{game.title}</Link>
            <p>{game.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
