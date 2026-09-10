import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const cfoFeasibilitySession = buildMethodTree(specBySlug("cfo-feasibility"));
export default cfoFeasibilitySession;
