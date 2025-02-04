import couchbase from "couchbase";

// Load environment variables
const COUCHBASE_URL = process.env.COUCHBASE_URL || "couchbase://localhost";
const COUCHBASE_USERNAME = process.env.COUCHBASE_USERNAME || "Administrator";
const COUCHBASE_PASSWORD = process.env.COUCHBASE_PASSWORD || "password";
const COUCHBASE_BUCKET = process.env.COUCHBASE_BUCKET || "mybucket";

let cluster: couchbase.Cluster;
let bucket: couchbase.Bucket;
let collection: couchbase.Collection;

async function connectToCouchbase() {
  if (!cluster) {
    cluster = await couchbase.connect(COUCHBASE_URL, {
      username: COUCHBASE_USERNAME,
      password: COUCHBASE_PASSWORD,
    });
    bucket = cluster.bucket(COUCHBASE_BUCKET);
    collection = bucket.defaultCollection();
  }
}

export { connectToCouchbase, cluster, bucket, collection };
