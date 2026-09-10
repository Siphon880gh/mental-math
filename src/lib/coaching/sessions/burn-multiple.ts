import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const burnMultipleSession = buildMethodTree(specBySlug("burn-multiple"));
export default burnMultipleSession;
