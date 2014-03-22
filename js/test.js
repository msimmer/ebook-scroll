function test(o, p) {
    if (p !== undefined) {
        return p;
    }
    return o;

}

obj = {};
obj = {
    foo: 'bar'
};

var r = test(obj);

//
console.log(r);
