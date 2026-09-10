import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const mrrArrSession = buildMethodTree(specBySlug("mrr-arr"));
export default mrrArrSession;
