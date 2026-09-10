import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const churnSession = buildMethodTree(specBySlug("churn"));
export default churnSession;
