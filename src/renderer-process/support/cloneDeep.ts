function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
function stubFalse() {
  return false;
}

var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  // var Buffer = Buffer,
    // Symbol = Symbol,
    // Uint8Array = context.Uint8Array,
    var allocUnsafe = Buffer.allocUnsafe,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = Object.prototype.propertyIsEnumerable,
    splice = Array.prototype.splice,
    spreadableSymbol =Symbol.isConcatSpreadable,
    symIterator = Symbol.iterator,
    symToStringTag = Symbol.toStringTag;

var nativeCeil = Math.ceil,
      nativeFloor = Math.floor,
      nativeGetSymbols = Object.getOwnPropertySymbols,
      nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
      nativeIsFinite = isFinite,
      nativeJoin = Array.prototype.join,
      nativeKeys = overArg(Object.keys, Object),
      nativeMax = Math.max,
      nativeMin = Math.min,
      nativeNow = Date.now,
      nativeParseInt = parseInt,
      nativeRandom = Math.random,
      nativeReverse = Array.prototype.reverse;

var isBuffer = nativeIsBuffer || stubFalse;

function cloneDeep(value)
{
    return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}
function  baseClone(value, bitmask, customizer, key, object, stack)
{
    var result,
        isDeep = bitmask & CLONE_DEEP_FLAG,
        isFlat = bitmask & CLONE_FLAT_FLAG,
        isFull = bitmask & CLONE_SYMBOLS_FLAG;

    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== undefined) {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag(value),
          isFunc = tag == funcTag || tag == genTag;

      if (isBuffer(value)) {
        return cloneBuffer(value, isDeep);
      }
      if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
        result = (isFlat || isFunc) ? {} : initCloneObject(value);
        if (!isDeep) {
          return isFlat
            ? copySymbolsIn(value, baseAssignIn(result, value))
            : copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag(value, tag, isDeep);
      }
    }
    // Check for circular references and return its corresponding clone.
    stack || (stack = new Stack);
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);

    if (isSet(value)) {
      value.forEach(function(subValue) {
        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
      });
    } else if (isMap(value)) {
      value.forEach(function(subValue, key) {
        result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
    }

    var keysFunc = isFull
      ? (isFlat ? getAllKeysIn : getAllKeys)
      : (isFlat ? keysIn : keys);

    var props = isArr ? undefined : keysFunc(value);
    arrayEach(props || value, function(subValue, key) {
      if (props) {
        key = subValue;
        subValue = value[key];
      }
      // Recursively populate clone (susceptible to call stack limits).
      assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
    return result;
  }

function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }
  function isArray(obj)
  {
    try {
        if (!obj)
            return false;
        else if (isIE && !isFunction(obj) && typeof obj == "object" && isFinite(obj.length) && obj.nodeType != 8)
            return true;
        else if (isFinite(obj.length) && isFunction(obj.splice))
            return true;
        else if (isFinite(obj.length) && isFunction(obj.callee)) // arguments
            return true;
        else if (instanceOf(obj, "HTMLCollection"))
            return true;
        else if (instanceOf(obj, "NodeList"))
            return true;
        else
            return false;
    }
    catch(exc)
    {
        if (FBTrace.DBG_ERRORS)
        {
            FBTrace.sysout("isArray FAILS:", exc);  /* Something weird: without the try/catch, OOM, with no exception?? */
            FBTrace.sysout("isArray Fails on obj", obj);
        }
    }

    return false;
}
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  function getTag(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);
    return result;
  }