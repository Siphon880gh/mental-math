import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const crissCrossSession = buildMethodTree(specBySlug("criss-cross"));
export default crissCrossSession;
