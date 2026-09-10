import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const cfoGrowthSession = buildMethodTree(specBySlug("cfo-growth"));
export default cfoGrowthSession;
