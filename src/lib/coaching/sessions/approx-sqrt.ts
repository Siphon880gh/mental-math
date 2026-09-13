import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const approxSqrtSession = buildMethodTree(specBySlug("approx-sqrt"));
export default approxSqrtSession;
