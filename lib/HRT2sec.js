/**
 * Convert Node's process.hrtime() format to seconds
 *
 * @param {Array} HRTime - high resolution time array
 * @returns {Number} - time in seconds
 */
export default function HRT2sec(HRTime) {

    const [ sec, nano ] = HRTime;
    return (sec + nano * 1e-9).toFixed(5);
};
