import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const takeRateSession = buildMethodTree(specBySlug("take-rate"));
export default takeRateSession;
