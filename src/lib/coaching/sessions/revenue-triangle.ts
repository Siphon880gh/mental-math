import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const revenueTriangleSession = buildMethodTree(specBySlug("revenue-triangle"));
export default revenueTriangleSession;
