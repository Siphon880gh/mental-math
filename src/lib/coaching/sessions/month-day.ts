import { buildMethodTree } from "../buildMethodTree";
import { specBySlug } from "./specs";

const monthDaySession = buildMethodTree(specBySlug("month-day"));
export default monthDaySession;
