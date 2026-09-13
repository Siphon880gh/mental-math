import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const paretoSession = buildMethodTree(specBySlug("pareto"));
export default paretoSession;
