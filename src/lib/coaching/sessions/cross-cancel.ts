import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const crossCancelSession = buildMethodTree(specBySlug("cross-cancel"));
export default crossCancelSession;
