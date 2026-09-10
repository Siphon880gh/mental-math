import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const monthYearSession = buildMethodTree(specBySlug("month-year"));
export default monthYearSession;
