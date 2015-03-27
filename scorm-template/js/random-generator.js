var randomUtils = {
    // Returns a random number between min (inclusive) and max (exclusive)
    getRandomArbitrary:function(min, max)
    {
        return Math.random() * (max - min) + min;
    },

    //Returns a random number limit betwen max and min and also an increment
    RoundInc:function(num, inc, min, max) {
        var n = Math.abs(inc); // Change to positive
        var decimal = n - Math.floor(n);
        var cant = this.decimalPlaces(decimal);
        var mul = 1;
        for (var i = 1; i <= cant; i++) {
            mul *= 10;
        }
        if (num % inc == 0) {
            if ((Math.round((num + (min % inc)) * mul) / mul) > max)
                return Math.round((num - (min % inc)) * mul) / mul
            else
                return Math.round((num + (min % inc)) * mul) / mul
        } else {
            var falta = num % inc;
            if ((Math.round((num + inc - falta + (min % inc)) * mul) / mul) > max)
                return Math.round((num - falta + (min % inc)) * mul) / mul
            else
                return Math.round((num + inc - falta + (min % inc)) * mul) / mul
        }
    },

    // Returns a random integer between min (inclusive) and max (inclusive). Using Math.round() will give you a non-uniform distribution!
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    //Return the cant of decimal places in a decimal number
    decimalPlaces:function (num) {
        var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) {
            return 0;
        }
        return Math.max(
            0,
            // Number of digits right of decimal point.
            (match[1] ? match[1].length : 0)
                // Adjust for scientific notation.
            - (match[2] ? +match[2] : 0));
    }
}