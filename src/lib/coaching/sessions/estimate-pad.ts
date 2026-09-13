import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const estimatePadSession = buildMethodTree(specBySlug("estimate-pad"));
export default estimatePadSession;
