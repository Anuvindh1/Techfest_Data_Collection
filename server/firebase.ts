// Firebase Realtime Database REST API wrapper
// Uses Firebase REST API for server-side operations without requiring Admin SDK private key

class FirebaseDatabase {
  private baseUrl: string;

  constructor() {
    const dbUrl = process.env.FIREBASE_DATABASE_URL || "";
    this.baseUrl = dbUrl.endsWith("/") ? dbUrl.slice(0, -1) : dbUrl;
  }

  ref(path: string) {
    return new DatabaseReference(this.baseUrl, path);
  }
}

class DatabaseReference {
  private url: string;
  private baseUrl: string;
  private path: string;

  constructor(baseUrl: string, path: string) {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    this.baseUrl = baseUrl;
    this.path = cleanPath;
    this.url = `${baseUrl}/${cleanPath}.json`;
  }

  child(childPath: string) {
    const newPath = this.path ? `${this.path}/${childPath}` : childPath;
    return new DatabaseReference(this.baseUrl, newPath);
  }

  async set(value: any): Promise<void> {
    const response = await fetch(this.url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Firebase set failed: ${response.status} - ${text}`);
    }
  }

  async update(value: any): Promise<void> {
    const response = await fetch(this.url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Firebase update failed: ${response.status} - ${text}`);
    }
  }

  async once(eventType: string): Promise<DataSnapshot> {
    const response = await fetch(this.url);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Firebase read failed: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return new DataSnapshot(data);
  }

  async transaction(updateFunction: (currentValue: any) => any): Promise<void> {
    // Simple transaction implementation
    // For production, consider using Firebase Admin SDK with proper credentials
    const snapshot = await this.once("value");
    const currentValue = snapshot.val();
    const newValue = updateFunction(currentValue);
    
    if (newValue !== undefined) {
      await this.set(newValue);
    }
  }
}

class DataSnapshot {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  exists(): boolean {
    return this.data !== null && this.data !== undefined;
  }

  val(): any {
    return this.data;
  }
}

export const db = new FirebaseDatabase();
