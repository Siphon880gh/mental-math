import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const cfoUnitEconSession = buildMethodTree(specBySlug("cfo-unit-econ"));
export default cfoUnitEconSession;
