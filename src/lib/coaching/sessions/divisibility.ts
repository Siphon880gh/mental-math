import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const divisibilitySession = buildMethodTree(specBySlug("divisibility"));
export default divisibilitySession;
