module.exports = str => {
    str = str.replace(/\#/, '');
    const result = [];
    while (str.length >= 2) { 
        result.push(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }
	return (result[0] << 16) | (result[1] << 8) | result[2];
};