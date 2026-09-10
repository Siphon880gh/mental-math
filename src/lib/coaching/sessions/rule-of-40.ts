import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const ruleOf40Session = buildMethodTree(specBySlug("rule-of-40"));
export default ruleOf40Session;
