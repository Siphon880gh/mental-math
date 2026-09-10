import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const cacPaybackSession = buildMethodTree(specBySlug("cac-payback"));
export default cacPaybackSession;
