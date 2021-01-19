/**
 * Spies on all functions of a complete object.
 * Note: There is a spyOnAllFunctions from jasmine, but it does not work with classes (double constructor spy error).
 */
export function spyOnObject(obj: any) {
  let pointer = obj;
  const methods = [];

  while (pointer) {
    for (const method of Object.getOwnPropertyNames(pointer)) {
      const descriptor = Object.getOwnPropertyDescriptor(pointer, method);
      if ((descriptor.writable || descriptor.set) && descriptor.configurable && !descriptor.get) {
        methods.push(method);
      }
    }
    pointer = Object.getPrototypeOf(pointer);
  }

  for (const method of methods) {
    if (method === 'constructor') {
      // We don't need the constructor spy
      continue;
    }

    spyOn(obj, method);
  }

  return obj;
}
