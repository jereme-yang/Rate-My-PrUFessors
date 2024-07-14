export default class LRUCache {
    constructor(limit) {
      this.limit = limit;
      this.cache = new Map(); // Use Map to maintain order of insertion
    }
  
    get(key) {
      if (!this.cache.has(key)) {
        return null;
      }
  
      // Refresh the key by re-inserting it
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
  
      return value;
    }
  
    set(key, value) {
      if (this.cache.has(key)) {
        // Remove the existing key to refresh its position
        this.cache.delete(key);
      } else if (this.cache.size === this.limit) {
        // Remove the oldest item
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
  
      this.cache.set(key, value);
    }
  }