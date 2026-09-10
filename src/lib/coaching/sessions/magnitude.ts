import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const magnitudeSession = buildMethodTree(specBySlug("magnitude"));
export default magnitudeSession;
