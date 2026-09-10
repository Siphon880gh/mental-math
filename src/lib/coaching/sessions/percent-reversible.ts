import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const percentReversibleSession = buildMethodTree(specBySlug("percent-reversible"));
export default percentReversibleSession;
