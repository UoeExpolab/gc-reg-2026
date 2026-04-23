import Airtable from 'airtable';

if (!process.env.AIRTABLE_PAT) {
  console.warn("Missing AIRTABLE_PAT environment variable");
}

if (!process.env.AIRTABLE_BASE_ID) {
  console.warn("Missing AIRTABLE_BASE_ID environment variable");
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT || "dummy_pat" }).base(
  process.env.AIRTABLE_BASE_ID || "dummy_base"
);

export default base;
