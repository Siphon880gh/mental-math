import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const percentShiftSession = buildMethodTree(specBySlug("percent-shift"));
export default percentShiftSession;
