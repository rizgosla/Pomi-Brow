import { service } from "./service";
import { learnArticle } from "./learnArticle";
import { review } from "./review";
import { siteSettings } from "./siteSettings";
import { sectionTypes } from "./sections";

export const schemaTypes = [service, learnArticle, review, siteSettings, ...sectionTypes];
