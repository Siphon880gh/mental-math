import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const complementsSession = buildMethodTree(specBySlug("complements"));
export default complementsSession;
