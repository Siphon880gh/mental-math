import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const equalAdjustSession = buildMethodTree(specBySlug("equal-adjust"));
export default equalAdjustSession;
