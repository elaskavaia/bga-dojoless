function funcClass(type) {
  const FuncClass = function (...args) {
    const _source = Reflect.construct(type, args, this.constructor);

    const keys = Reflect.ownKeys(_source);
    for (const key of keys) {
      if (!key.match || !key.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
        const desc = Object.getOwnPropertyDescriptor(_source, key);
        !this[key] && Object.defineProperty(this, key, desc);
      }
    }
  };
  FuncClass.prototype = type.prototype;
  FuncClass.declaredClass = type.name;

  return FuncClass;
}
/**
 *
 * @param {object} derivedClass
 * @param {array} baseClasses
 */
function applyClassMixins(derivedClass, baseClasses) {
  baseClasses.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      if (name !== "constructor") {
        derivedClass.prototype[name] = baseCtor.prototype[name];
        derivedClass.prototype[name].nom = name;
      }
    });
  });
}

/**
 *
 * @param {object} dest
 * @param {object} source
 */
 function customMixin(dest, source) {
    let prot = source;
    dest.super = {};
    while (Object.getPrototypeOf(prot) != Object.prototype) {
      prot = Object.getPrototypeOf(prot);
      Object.getOwnPropertyNames(prot).forEach((name) => {
        if (name !== "constructor") {
          if (dest[name] !== undefined) {
            // preserve the original for inheritance
            console.log("Overriding " + name + " " + typeof dest[name]);
            dest.super[name] = dojo.hitch(dest, dest[name]);
          }
          dest[name] = dojo.hitch(dest, source[name]);
        }
      });
    }
    dojo.safeMixin(dest, source);
  }
  