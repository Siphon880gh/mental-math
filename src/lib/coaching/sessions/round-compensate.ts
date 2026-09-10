import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const roundCompensateSession = buildMethodTree(specBySlug("round-compensate"));
export default roundCompensateSession;
