import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const nrrSession = buildMethodTree(specBySlug("nrr"));
export default nrrSession;
