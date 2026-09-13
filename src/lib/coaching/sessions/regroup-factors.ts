import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const regroupFactorsSession = buildMethodTree(specBySlug("regroup-factors"));
export default regroupFactorsSession;
