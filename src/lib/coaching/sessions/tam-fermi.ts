import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const tamFermiSession = buildMethodTree(specBySlug("tam-fermi"));
export default tamFermiSession;
