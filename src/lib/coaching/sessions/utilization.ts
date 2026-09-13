import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const utilizationSession = buildMethodTree(specBySlug("utilization"));
export default utilizationSession;
