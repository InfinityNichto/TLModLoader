export function extendPrototypes() {
    Object.defineProperties(Uint8Array.prototype, {
        Length: {
            get: () => {
                return this.length;
            }
        }
    });

    Object.defineProperties(Object.prototype, {
        TryGetValue: {
            value: (key) => {
                if (this.hasOwnProperty(key)) {
                    return { success: true, value: this[key] };
                } else {
                    return { success: false, value: undefined };
                }
            },

            writable: true,
            configurable: true
        }
    });  
}