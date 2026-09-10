import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const dilutionSession = buildMethodTree(specBySlug("dilution"));
export default dilutionSession;
