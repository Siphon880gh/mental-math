import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const capacitySplitSession = buildMethodTree(specBySlug("capacity-split"));
export default capacitySplitSession;
