import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const multiplyNearSession = buildMethodTree(specBySlug("multiply-near"));
export default multiplyNearSession;
