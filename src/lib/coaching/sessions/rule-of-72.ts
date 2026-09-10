import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const ruleOf72Session = buildMethodTree(specBySlug("rule-of-72"));
export default ruleOf72Session;
