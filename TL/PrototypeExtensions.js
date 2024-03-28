export function extendPrototypes() {
    Object.defineProperties(Uint8Array.prototype, {
        Length: {
            get: function() {
                return this.length;
            }
        }
    });

    Object.defineProperties(Object.prototype, {
        TryGetValue: {
            value: function(key) {
                if (this.hasOwnProperty(key)) {
                    return { found: true, value: this[key] };
                } else {
                    return { found: false, value: undefined };
                }
            },

            writable: true,
            configurable: true
        }
    });

    Object.defineProperties(String.prototype, {
        TryParseInt: {
            value: function() {
                let int = parseInt(this);
                return isNaN(int) ? new Error("ParseInt is not applicable") : int;
            },

            configurable: true,
            enumerable: false
        }
    });

    Object.defineProperties(Array.prototype, {
        getOrDefault: {
            value: function(index, defaultValue) {
                if (defaultValue == undefined) {
                    switch(typeof this[0]) {
                    case "number":
                        return 0;
                    case "string":
                        return "";
                    case "boolean":
                        return false;
                    default:
                        return null;
                    }
                }
                return this[index] != undefined ? this[index] : defaultValue;
            },
            
            enumerable: false,
            configurable: true
        }
    });
}