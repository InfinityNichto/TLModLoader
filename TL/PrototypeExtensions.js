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
}