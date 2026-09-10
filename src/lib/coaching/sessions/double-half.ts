import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const doubleHalfSession = buildMethodTree(specBySlug("double-half"));
export default doubleHalfSession;
