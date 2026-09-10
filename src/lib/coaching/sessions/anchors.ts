import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const anchorsSession = buildMethodTree(specBySlug("anchors"));
export default anchorsSession;
