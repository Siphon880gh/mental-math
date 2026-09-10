import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const fullyLoadedSession = buildMethodTree(specBySlug("fully-loaded"));
export default fullyLoadedSession;
