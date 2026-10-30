// Keep failures by record so unrelated successful writes cannot hide them.
export function createOperations(onError) {
  let cancelled = false;
  const failed = new Map(),
    versions = new Map();
  const report = () => onError(failed.size ? [...failed.values()].at(-1).message : null);
  const run = async (
    operation,
    key = operation,
    message = 'Your changes could not be saved. Keep this tab open and try again.',
  ) => {
    if (cancelled) return false;
    const version = (versions.get(key) || 0) + 1;
    versions.set(key, version);
    try {
      await operation();
      if (!cancelled && versions.get(key) === version) {
        failed.delete(key);
        report();
      }
      return true;
    } catch {
      if (!cancelled && versions.get(key) === version) {
        failed.set(key, { operation, message });
        report();
      }
      return false;
    }
  };
  return {
    cancel: () => {
      cancelled = true;
      failed.clear();
    },
    run,
    retry: async () => {
      for (const [key, item] of [...failed]) {
        if (failed.get(key) === item) await run(item.operation, key, item.message);
      }
    },
  };
}
