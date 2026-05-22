import Airtable from 'airtable';

let cachedBase: Airtable.Base | null = null;

function getBase() {
  if (!cachedBase) {
    if (!process.env.AIRTABLE_PAT) {
      console.warn("Missing AIRTABLE_PAT environment variable");
    }

    if (!process.env.AIRTABLE_BASE_ID) {
      console.warn("Missing AIRTABLE_BASE_ID environment variable");
    }

    cachedBase = new Airtable({ apiKey: process.env.AIRTABLE_PAT || "dummy_pat" }).base(
      process.env.AIRTABLE_BASE_ID || "dummy_base"
    );
  }

  return cachedBase;
}

export default function base(tableName: string) {
  return getBase()(tableName);
}
