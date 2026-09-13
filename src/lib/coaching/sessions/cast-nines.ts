import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const castNinesSession = buildMethodTree(specBySlug("cast-nines"));
export default castNinesSession;
