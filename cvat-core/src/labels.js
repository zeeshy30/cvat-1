/*
* Copyright (C) 2019 Intel Corporation
* SPDX-License-Identifier: MIT
*/

/* global
    require:false
*/

(() => {
    const {
        AttributeType,
        colors,
    } = require('./enums');
    const { ArgumentError } = require('./exceptions');

    /**
        * Class representing an attribute
        * @memberof module:API.cvat.classes
        * @hideconstructor
    */
    class Attribute {
        constructor(initialData) {
            const data = {
                id: undefined,
                default_value: undefined,
                input_type: undefined,
                mutable: undefined,
                name: undefined,
                values: undefined,
            };

            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (Object.prototype.hasOwnProperty.call(initialData, key)) {
                        if (Array.isArray(initialData[key])) {
                            data[key] = [...initialData[key]];
                        } else {
                            data[key] = initialData[key];
                        }
                    }
                }
            }

            if (!Object.values(AttributeType).includes(data.input_type)) {
                throw new ArgumentError(
                    `Got invalid attribute type ${data.input_type}`,
                );
            }

            Object.defineProperties(this, Object.freeze({
                /**
                    * @name id
                    * @type {integer}
                    * @memberof module:API.cvat.classes.Attribute
                    * @readonly
                    * @instance
                */
                id: {
                    get: () => data.id,
                },
                /**
                    * @name defaultValue
                    * @type {(string|integer|boolean)}
                    * @memberof module:API.cvat.classes.Attribute
                    * @readonly
                    * @instance
                */
                defaultValue: {
                    get: () => data.default_value,
                },
                /**
                    * @name inputType
                    * @type {module:API.cvat.enums.AttributeType}
                    * @memberof module:API.cvat.classes.Attribute
                    * @readonly
                    * @instance
                */
                inputType: {
                    get: () => data.input_type,
                },
                /**
                    * @name mutable
                    * @type {boolean}
                    * @memberof module:API.cvat.classes.Attribute
                    * @readonly
                    * @instance
                */
                mutable: {
                    get: () => data.mutable,
                },
                /**
                    * @name name
                    * @type {string}
                    * @memberof module:API.cvat.classes.Attribute
                    * @readonly
                    * @instance
                */
                name: {
                    get: () => data.name,
                },
                /**
                    * @name values
                    * @type {(string[]|integer[]|boolean[])}
                    * @memberof module:API.cvat.classes.Attribute
                    * @readonly
                    * @instance
                */
                values: {
                    get: () => [...data.values],
                },
            }));
        }

        toJSON() {
            const object = {
                name: this.name,
                mutable: this.mutable,
                input_type: this.inputType,
                default_value: this.defaultValue,
                values: this.values,
            };

            if (typeof (this.id) !== 'undefined') {
                object.id = this.id;
            }

            return object;
        }
    }

    /**
        * Class representing a label
        * @memberof module:API.cvat.classes
        * @hideconstructor
    */
    class Label {
        constructor(initialData) {
            const data = {
                id: undefined,
                name: undefined,
                color: undefined,
            };

            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (Object.prototype.hasOwnProperty.call(initialData, key)) {
                        data[key] = initialData[key];
                    }
                }
            }

            if (typeof (data.id) !== 'undefined') {
                data.color = colors[data.id % colors.length];
            }
            data.attributes = [];

            if (Object.prototype.hasOwnProperty.call(initialData, 'attributes')
                && Array.isArray(initialData.attributes)) {
                for (const attrData of initialData.attributes) {
                    data.attributes.push(new Attribute(attrData));
                }
            }

            Object.defineProperties(this, Object.freeze({
                /**
                    * @name id
                    * @type {integer}
                    * @memberof module:API.cvat.classes.Label
                    * @readonly
                    * @instance
                */
                id: {
                    get: () => data.id,
                },
                /**
                    * @name name
                    * @type {string}
                    * @memberof module:API.cvat.classes.Label
                    * @readonly
                    * @instance
                */
                name: {
                    get: () => data.name,
                },
                /**
                    * @name color
                    * @type {string}
                    * @memberof module:API.cvat.classes.Label
                    * @readonly
                    * @instance
                */
                color: {
                    get: () => data.color,
                    set: (color) => {
                        if (colors.includes(color)) {
                            data.color = color;
                        } else {
                            throw new ArgumentError('Trying to set unknown color');
                        }
                    },
                },
                /**
                    * @name attributes
                    * @type {module:API.cvat.classes.Attribute[]}
                    * @memberof module:API.cvat.classes.Label
                    * @readonly
                    * @instance
                */
                attributes: {
                    get: () => [...data.attributes],
                },
            }));
        }

        toJSON() {
            const object = {
                name: this.name,
                attributes: [...this.attributes.map((el) => el.toJSON())],
            };

            if (typeof (this.id) !== 'undefined') {
                object.id = this.id;
            }

            return object;
        }
    }

    module.exports = {
        Attribute,
        Label,
    };
})();
