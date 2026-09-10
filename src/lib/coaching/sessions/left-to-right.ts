import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const leftToRightSession = buildMethodTree(specBySlug("left-to-right"));
export default leftToRightSession;
