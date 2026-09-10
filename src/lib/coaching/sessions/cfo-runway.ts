import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const cfoRunwaySession = buildMethodTree(specBySlug("cfo-runway"));
export default cfoRunwaySession;
