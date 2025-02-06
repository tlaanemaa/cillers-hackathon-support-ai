import { connect, Cluster, Bucket, Collection } from "couchbase";

// Load environment variables
const COUCHBASE_URL = process.env.COUCHBASE_URL || "couchbase://localhost";
const COUCHBASE_USERNAME = process.env.COUCHBASE_USERNAME || "Administrator";
const COUCHBASE_PASSWORD = process.env.COUCHBASE_PASSWORD || "password";
const COUCHBASE_BUCKET = process.env.COUCHBASE_BUCKET || "mybucket";

class Couchbase {
  public cluster?: Cluster;
  public bucket?: Bucket;
  public collection?: Collection;

  async connect() {
    this.cluster = await connect(COUCHBASE_URL, {
      username: COUCHBASE_USERNAME,
      password: COUCHBASE_PASSWORD,
    });
    this.bucket = this.cluster.bucket(COUCHBASE_BUCKET);
    this.collection = this.bucket.defaultCollection();
  }
}

const couchbase = new Couchbase();
export default couchbase;