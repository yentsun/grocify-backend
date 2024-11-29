/**
 * Replace field values with asterisks
 *
 * @param input {Object} - input object (will remain untouched)
 * @param fieldNames {Array.<String>} - field names to screen
 * @return {Object} - output object
 */
export default function screenPassword(input, fieldNames=['password']) {

    const output = { ...input };

        fieldNames.forEach(fieldToMask => {
        if (fieldToMask in input) {
            output[fieldToMask] = output[fieldToMask]?.replace(/./g, '*');
        }
    });

    return output;
};
